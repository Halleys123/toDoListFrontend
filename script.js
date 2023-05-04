const userLabel = document.querySelector(".login__user__label");
const passLabel = document.querySelector(".login__pass__label");
const userInput = document.querySelector(".login__user__input");
const passInput = document.querySelector(".login__pass__input");
const loginButton = document.querySelector(".login__button");
const container = document.querySelector(".container");
const welcomeText = document.querySelector(".login__welcome");
const modal = document.querySelector(".modal");

const signupForm = document.querySelector(".signup");
const signupButtonOne = document.querySelector(".signup__pages__pageOne--next");
const signupButtonTwo = document.querySelector(".signup__pages__pageTwo--next");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm__pass");
const nameInput = document.getElementById("name");
const usernameInput = document.getElementById("username");

const pageOneFields = document.querySelectorAll(
  ".signup__pages__pageOne__inputs__input__field"
);
const pageTwoFields = document.querySelectorAll(
  ".signup__pages__pageTwo__inputs__input__field"
);
const addButton = document.querySelector(
  ".container__items__itemAdd__lower--addButton"
);
// const pageOneFieldTwo = document.querySelector(".signup__pages__page__inputs__input__field");
let userName;
let tasks = [];
let ip = "192.168.29.122:8000";
// ip = "127.0.0.1:8000";
class itemModifier {
  constructor(element) {
    this.item = element;
    this.itemNo = element.getAttribute("data-itemNo");
    this.itemName = element.querySelector(".container__items__item--text");
  }
  deleteItem() {
    modal.classList.remove("hidden");
    document.querySelector("span").innerHTML = this.itemName.innerHTML;
    const yes = document.querySelector(".yes");
    const cancel = document.querySelector(".cancel");

    yes.addEventListener("click", () => {
      this.item.remove();
      tasks = removeArrayElement(tasks, this.itemName.innerHTML);

      fetch(`http://${ip}/user/task/delete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          task: this.itemName.innerHTML,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
      modal.classList.add("hidden");
    });
    cancel.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }
  showLabel() {
    this.item
      .querySelector(".container__items__item--icon")
      .addEventListener("mouseover", (e) => {
        document.querySelector(".helper").style.left =
          this.item.getBoundingClientRect().left + "px";
        document.querySelector(".helper").style.top =
          this.item.getBoundingClientRect().top + 12 + "px";

        document.querySelector(".helper__item--one--text").innerHTML =
          tasks[this.itemNo - 1].task;
        document.querySelector(".helper__item--two--text").innerHTML = new Date(
          tasks[this.itemNo - 1].createdOn
        ).toDateString();
        document.querySelector(".helper__item--three--text").innerHTML =
          new Date(tasks[this.itemNo - 1].completeBy).toDateString();
        document.querySelector(".helper__item--four--text").innerHTML =
          tasks[this.itemNo - 1].description;

        document.querySelector(".helper").classList.add("maximize");
        document.querySelector(".helper").classList.add("opacityOne");
      });
    this.item
      .querySelector(".container__items__item--icon")
      .addEventListener("mouseout", () => {
        document.querySelector(".helper").classList.remove("maximize");
        document.querySelector(".helper").classList.remove("opacityOne");
      });
  }
  static clearTask() {
    tasks = [];
  }
  static loadItems() {
    document.querySelectorAll(".container__items__item").forEach((item) => {
      item.remove();
    });
    tasks.forEach((task, index) => {
      const { item, button } = createElement(task, index);
      const itemMod = new itemModifier(item);
      itemMod.showLabel();

      document
        .querySelector(".container__items")
        .insertAdjacentElement("afterbegin", item);

      button.addEventListener("click", () => {
        itemMod.deleteItem();
      });
    });
  }
}

class InputField {
  constructor(input, label) {
    this.input = input;
    this.label = label;
  }
  checkInput() {
    if (this.input.value.length > 0) {
      this.label.classList.add("login__div__label--hidden");
      this.input.setAttribute("data-filled", 1);
    } else {
      this.label.classList.remove("login__div__label--hidden");
      this.input.setAttribute("data-filled", 0);
    }
    InputField.checkAll();
  }
  textChange() {
    this.input.addEventListener("input", () => {
      if (
        !this.input.parentElement.classList.contains(
          "signup__pages__page__inputs__input"
        )
      )
        signupForm.classList.remove("maximize");
      this.checkInput();
    });
  }
  labelClick() {
    this.label.addEventListener("click", () => {
      this.input.focus();
    });
  }
  static checkAll() {
    loginValidator.validate();
  }
}

class validateField {
  constructor(button, fieldsArray, classToAdd) {
    this.button = button;
    this.fields = fieldsArray;
    this.classToAdd = classToAdd;
  }
  validate() {
    const totalCount = this.fields.length;
    let currentCount = 0;
    this.fields.forEach((ele) => {
      if (ele.value != "") {
        currentCount++;
      }
    });
    if (currentCount == totalCount) {
      this.button.classList.remove(this.classToAdd);
    } else {
      this.button.classList.add(this.classToAdd);
    }
  }
}
const loginValidator = new validateField(
  loginButton,
  [
    document.querySelector(".login__pass__input"),
    document.querySelector(".login__user__input"),
  ],
  "login__button--disabled"
);

const signupValidator = new validateField(
  signupButtonOne,
  pageOneFields,
  "signup__pages__pageOne--next--disabled"
);
const signupValidator1 = new validateField(
  signupButtonTwo,
  pageTwoFields,
  "signup__pages__pageTwo--next--disabled"
);

pageOneFields.forEach((field, index) => {
  const input = field;
  const label = document.querySelectorAll(".signup__label")[index];
  const inputField = new InputField(input, label);
  inputField.textChange();
  inputField.labelClick();
});
pageTwoFields.forEach((field, index) => {
  const input = field;
  const label = document.querySelectorAll(".signup__label")[index + 3];
  const inputField = new InputField(input, label);
  inputField.textChange();
  inputField.labelClick();
});

pageOneFields.forEach((field) => {
  field.addEventListener("input", () => {
    signupValidator.validate();
  });
});
pageTwoFields.forEach((field) => {
  field.addEventListener("input", () => {
    signupValidator1.validate();
  });
});
function createElement(task, index) {
  let date = task["completeBy"];
  date = new Date(date);
  date = date.toDateString();
  date = date.split(" ");
  date = date[1] + " " + date[2] + ", " + date[3];

  const item = document.createElement("div");
  item.classList.add("container__items__item");
  item.classList.add("container__items__item1");
  item.setAttribute("data-itemNo", index + 1);

  const itemText = document.createElement("p");
  itemText.classList.add("container__items__item--text");
  itemText.classList.add("container__items__item--head");
  itemText.innerHTML = task["task"];

  const div = document.createElement("div");
  div.classList.add("container__items__item__lower");

  const subDiv = document.createElement("div");
  subDiv.classList.add("container__items__item__lower__box");

  const lastBy = document.createElement("p");
  lastBy.classList.add("container__items__item__lower__box--text");
  lastBy.classList.add("container__items__item__lower__box--lastDate");
  lastBy.innerHTML = "Last by: ";

  const lastByDate = document.createElement("p");
  lastByDate.classList.add("container__items__item__lower__box--text");
  lastByDate.classList.add("container__items__item__lower__box--lastDate");
  lastByDate.innerHTML = date;

  const deleteSvg = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  fill="#ff8787"
  viewBox="0 0 256 256"
  class="container__items__item--button"
>
  <path
    d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
  ></path>
</svg>`;
  const infoSvg = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  fill="#000000"
  viewBox="0 0 256 256"
  class="container__items__item--icon"
>
  <path
    d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"
  ></path>
</svg>`;

  subDiv.insertAdjacentElement("afterbegin", lastBy);
  subDiv.insertAdjacentElement("beforeend", lastByDate);

  div.insertAdjacentElement("afterbegin", subDiv);
  div.insertAdjacentHTML("beforeend", deleteSvg);

  item.insertAdjacentElement("afterbegin", itemText);
  item.insertAdjacentElement("beforeend", div);
  item.insertAdjacentHTML("beforeend", infoSvg);

  return { item, button: div.lastElementChild };
}

function removeArrayElement(array, element) {
  const newArray = [];
  array.filter((item) => {
    if (item.task != element) {
      newArray.push(item);
    }
  });
  return newArray;
}

tasks = tasks.filter((task) => {
  task = task.trim();
  task = task.split(" ");
  task.forEach((word, index) => {
    word = word.split("");
    word[0] = word[0].toUpperCase();
    word = word.join("");
    task[index] = word;
  });
  task = task.join(" ");

  return task;
});

tasks.forEach((task, index) => {
  const { item, button } = createElement(task, index);
  const itemMod = new itemModifier(item);
  itemMod.showLabel();
  document
    .querySelector(".container__items")
    .insertAdjacentElement("afterbegin", item);

  button.addEventListener("click", () => {
    itemMod.deleteItem();
  });
});

document
  .querySelector(".container__items__itemAdd--textHere")
  .addEventListener("input", (e) => {
    if (e.target.value.length > 0) {
      document.querySelector(
        ".container__items__itemAdd__lower--addButton"
      ).disabled = false;
    } else {
      document.querySelector(
        ".container__items__itemAdd__lower--addButton"
      ).disabled = true;
    }
  });

document
  .querySelector(".container__items__itemAdd__lower--addButton")
  .addEventListener("click", (e) => {
    const val = document.querySelector(".container__items__itemAdd--textHere");
    const date = document.querySelector(
      ".container__items__itemAdd__lower__date"
    ).value;

    const [task, description] = val.value.split(":");

    tasks.push({
      task: task.trim(),
      completeBy: date,
      createdOn: new Date().toLocaleDateString(),
      description: description.trim(),
    });
    val.value = "";
    e.target.disabled = true;
    fetch(`http://${ip}/user/task/add`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userName,
        data: tasks[tasks.length - 1],
      }),
    })
      .then((json) => json.json())
      .then((data) => {})
      .catch((err) => {
        alert("Error adding task");
      });

    itemModifier.loadItems();
  });

const user = new InputField(userInput, userLabel);
const pass = new InputField(passInput, passLabel);

user.textChange();
user.labelClick();

pass.textChange();
pass.labelClick();

loginButton.addEventListener("click", (e) => {
  if (e.target.getAttribute("title") == "Login") {
    fetch(`http://${ip}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.input.value,
        password: pass.input.value,
      }),
    })
      .then((json) => json.json())
      .then((data) => {
        if (data["status"] == "success") {
          pass.checkInput();
          user.checkInput();
          userName = data["data"]["username"];
          itemModifier.clearTask();
          data["data"]["toDoList"].forEach((task) => {
            tasks.push(task);
          });
          itemModifier.loadItems();
          container.classList.add("opacityOne");

          welcomeText.innerHTML = `Welcome back, ${data["data"]["name"]}`;
        } else {
          console.error("Wrong username or password");
          container.classList.remove("opacityOne");
          pass.checkInput();
          user.checkInput();
          itemModifier.clearTask();
          welcomeText.innerHTML = "Log In to Continue";
        }
      });

    userInput.value = "";
    passInput.value = "";
  } else {
    itemModifier.clearTask();
    itemModifier.loadItems();
    container.classList.remove("opacityOne");
    signupForm.classList.toggle("maximize");
  }
});

loginButton.addEventListener("mouseover", (e) => {
  if (userInput.value == "") {
    e.target.childNodes[0].data = "Sign Up";
    e.target.setAttribute("title", "Sign Up");
  }
  if (passInput.value == "") {
    e.target.childNodes[0].data = "Sign Up";
    e.target.setAttribute("title", "Sign Up");
  }
});

loginButton.addEventListener("mouseleave", (e) => {
  e.target.childNodes[0].data = "Login";
  e.target.setAttribute("title", "Login");
});

signupButtonOne.addEventListener("click", (e) => {
  if (!e.target.classList.contains("signup__pages__pageOne--next--disabled")) {
    document.querySelector(".signup__pages").classList.add("page2");
  }
});

signupButtonTwo.addEventListener("click", (e) => {
  if (confirmPasswordInput.value == passwordInput.value) {
    if (
      !e.target.classList.contains("signup__pages__pageOne--next--disabled")
    ) {
      fetch(`http://${ip}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput.value,
          password: passwordInput.value,
          name: nameInput.value,
          mail: emailInput.value,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data["status"] == "success") {
            console.log("success");
          }
        });
      document.querySelector(".signup__pages").classList.remove("page2");

      signupForm.classList.toggle("maximize");
      container.classList.add("opacityOne");
      welcomeText.innerHTML = `Welcome, ${nameInput.value}`;
      emailInput.value = "";
      nameInput.value = "";
      userInput.value = "";
      passwordInput.value = "";
      confirmPasswordInput.value = "";
    }
  } else {
    alert("Please confirm your password!!");
  }
});

emailInput.addEventListener("input", (e) => {
  //validate for email
  const emailRegex = /\S+@\S+\.\S+/;
  const email = e.target.value;

  if (emailRegex.test(email)) {
    e.target.classList.add("valid");
    e.target.classList.remove("invalid");
    signupButtonOne.classList.remove("signup__pages__pageOne--next--disabled");
  } else {
    e.target.classList.remove("valid");
    e.target.classList.add("invalid");
    signupButtonOne.classList.add("signup__pages__pageOne--next--disabled");
  }
});

passwordInput.addEventListener("input", (e) => {
  if (e.target.value.length >= 8) {
    e.target.classList.add("strong");
    e.target.classList.remove("weak");
    e.target.classList.remove("medium");
  } else if (e.target.value.length >= 4) {
    e.target.classList.add("medium");
    e.target.classList.remove("weak");
    e.target.classList.remove("strong");
  } else {
    e.target.classList.add("weak");
    e.target.classList.remove("medium");
    e.target.classList.remove("strong");
  }
});
confirmPasswordInput.addEventListener("input", (e) => {
  if (e.target.value == passwordInput.value) {
    e.target.classList.add("valid");
    e.target.classList.remove("invalid");
  } else {
    e.target.classList.remove("valid");
    e.target.classList.add("invalid");
  }
});
