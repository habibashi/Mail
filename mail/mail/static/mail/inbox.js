document.addEventListener('DOMContentLoaded', function () {

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

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view').style.display = 'none';


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
        }
        const body = document.createElement('div');
        body.append(email.body);
        leftRow.append(sender, body);

        rightRow.classList.add('rightRow');
        rightRow.append(email.timestamp);

        document.querySelector('#emails-view').append(row);

        if (email.read === false) {
          row.style.backgroundColor = 'lightgray';
        }

        row.addEventListener('click', () => {
          fetch(`/emails/${email.id}`)
            .then(response => response.json())
            .then(email => {
              // Print email
              console.log(email);

              document.querySelector('#emails-view').style.display = 'none';
              document.querySelector('#compose-view').style.display = 'none';
              document.querySelector('#view').style.display = 'block';

              const form = document.createElement('p');
              form.innerHTML = `<strong>Form:</strong> ${email.recipients}`;

              const to = document.createElement('p');
              to.innerHTML = `<strong>To:</strong> ${email.sender}`;

              const subject = document.createElement('p');
              subject.innerHTML = `<strong>Subject:</strong> ${email.subject}`;

              const timestamp = document.createElement('p');
              timestamp.innerHTML = `<strong>Timestamp</strong> ${email.timestamp}`;

              const button = document.createElement('button');
              button.innerHTML = 'reply';
              button.className = 'btn btn-outline-primary';


              // if (email.read === false){
              fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                  read: true
                })
              })
              const unarchive = document.createElement('button');
              const archived = document.createElement('button');
              if (email.archived === false) {
                archived.innerHTML = 'archive';
                archived.className = 'btn btn-outline-secondary';
                archived.classList.add('margin-left');
                unarchive.style.display = 'none';
              }
              archived.addEventListener('click', () => {
                fetch(`/emails/${email.id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                    archived: true
                  })
                })
              })
              if (email.archived === true) {
                unarchive.innerHTML = 'unarchive';
                unarchive.className = 'btn btn-outline-danger';
                unarchive.classList.add('margin-left');
                archived.style.display = 'none';
              }
              unarchive.addEventListener('click', () => {
                fetch(`/emails/${email.id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                    archived: false
                  })
                })
              })

              const hr = document.createElement('hr');

              const body = document.createElement('p');
              body.innerHTML = email.body;


              document.querySelector('#view').append(form, to, subject, timestamp, button, archived, unarchive, hr, body);


            });

        })




      }
    });

}