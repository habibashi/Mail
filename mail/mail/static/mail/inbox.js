document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').addEventListener('submit', () => {
    // e.preventDefault();
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: document.querySelector('#compose-recipients').value,
          subject: document.querySelector('#compose-subject').value,
          body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        // console.log(result);
    });
  })

  // By default, load the inbox
  load_mailbox('inbox');

  fetch(`/emails/body`)
    .then(response => response.json())
    .then(email => {
        // Print email
        console.log(email);

        // ... do something else with email ...
    });
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
   
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
        // Print emails
        console.log(emails);

        // ... do something else with emails ...
        for (let email of emails) {
          const row = document.createElement('div');
          row.classList.add('row');
          const leftRow = document.createElement('div');
          const rightRow = document.createElement('div');
          row.append(leftRow, rightRow);

          leftRow.classList.add('leftRow');
          const sender = document.createElement('strong');
          if (mailbox === 'sent') {
            sender.append(email.recipients);
          } else {
            sender.append(email.sender);
            // row.style.backgroundColor = 'lightgray'
          }
          const body = document.createElement('div');
          body.append(email.body);
          leftRow.append(sender, body);

          rightRow.classList.add('rightRow');
          rightRow.append(email.timestamp);

          document.querySelector('#emails-view').append(row);
          
          

          
        }
    });

}