const users = [];
let user = {}; // Currently logged-in user

const showLogin = () => {
  let str = `
    <div>
    <h1>Login Form</h1>
    <p><div id="dvMsg"></div></p>
    <p><input type="text" id="txtEmail" placeholder="Email"></p>
    <p><input type="password" id="txtPass" placeholder="Password"></p>
    <p><button onclick='validateUser()'>Log In</button></p>
    <p><button onclick='showRegister()'>Create Account</button></p>
    </div>
    `;
  root.innerHTML = str;
};

const showRegister = () => {
  let str = `
    <h1>Register Form</h1>
    <p><input type="text" id="txtName" placeholder="Name"></p>
    <p><input type="text" id="txtEmail" placeholder="Email"></p>
    <p><input type="password" id="txtPass" placeholder="Password"></p>
    <button onclick='addUser()'>Register</button>
    <hr>
    <button onClick='showLogin()'>Already a Member? Login here...</button>
    `;
  root.innerHTML = str;
};

const showHome = () => {
  let str = `
    <h1>Welcome ${user.name}</h1>
    <hr>
    <p>
      <select id="actionSelect" onchange="toggleTransferField()">
        <option value="0">--select--</option>
        <option value="1">Deposit</option>
        <option value="2">Withdraw</option>
        <option value="3">Transfer</option>
      </select>
    </p>
    <p>
      <input type='number' id='txtAmount' placeholder="Amount">
    </p>
    <p id="transferEmailField" style="display:none;">
      <input type="text" id="txtTransferEmail" placeholder="Recipient Email">
    </p>
    <p>
      <button onclick="handleTransaction()">Submit</button>
      <button onclick='showLogin()'>Logout</button>
    </p>
    <hr>
    <p>Current balance: <span id="balance">${user.balance}</span></p>
    <div id="txnMsg"></div>
    `;
  root.innerHTML = str;
};

const addUser = () => {
  const newUser = {
    name: document.getElementById("txtName").value,
    email: document.getElementById("txtEmail").value,
    pass: document.getElementById("txtPass").value,
    balance: 0
  };
  users.push(newUser);
  showLogin();
};

const validateUser = () => {
  let email = document.getElementById("txtEmail").value;
  let pass = document.getElementById("txtPass").value;
  let foundUser = users.find(
    (e) => e.email === email && e.pass === pass
  );
  if (foundUser) {
    user = foundUser; // Set the logged-in user
    showHome();
  } else {
    dvMsg.innerHTML = "Access Denied";
  }
};

// Show/hide recipient email field based on selection
function toggleTransferField() {
  const action = document.getElementById("actionSelect").value;
  const transferField = document.getElementById("transferEmailField");
  if (action === "3") {
    transferField.style.display = "";
  } else {
    transferField.style.display = "none";
  }
}

function handleTransaction() {
  const action = document.getElementById("actionSelect").value;
  const amount = Number(document.getElementById("txtAmount").value);
  let msg = "";

  if (action === "1") { // Deposit
    if (amount > 0) {
      user.balance += amount;
      msg = `Deposited ₹${amount}`;
    } else {
      msg = "Enter a valid amount to deposit.";
    }
  } else if (action === "2") { // Withdraw
    if (amount > 0 && amount <= user.balance) {
      user.balance -= amount;
      msg = `Withdrew ₹${amount}`;
    } else if (amount > user.balance) {
      msg = "Insufficient balance.";
    } else {
      msg = "Enter a valid amount to withdraw.";
    }
  } else if (action === "3") { // Transfer
    const recipientEmail = document.getElementById("txtTransferEmail").value.trim();
    if (!recipientEmail) {
      msg = "Enter recipient email.";
    } else if (recipientEmail === user.email) {
      msg = "Cannot transfer to your own account.";
    } else if (amount > 0 && amount <= user.balance) {
      const recipient = users.find(u => u.email === recipientEmail);
      if (recipient) {
        user.balance -= amount;
        recipient.balance += amount;
        msg = `Transferred ₹${amount} to ${recipient.name} (${recipient.email})`;
      } else {
        msg = "Recipient not found.";
      }
    } else if (amount > user.balance) {
      msg = "Insufficient balance.";
    } else {
      msg = "Enter a valid amount to transfer.";
    }
  } else {
    msg = "Please select an action.";
  }

  // Update balance display and show message
  document.getElementById("balance").innerText = user.balance;
  document.getElementById("txnMsg").innerText = msg;
}
