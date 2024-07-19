// Створіть змінну, яка зберігає ім'я користувача. Виведіть значення цієї змінної в консоль.
// Створіть змінну, яка зберігає вік користувача. Перетворіть цю змінну на рядок і виведіть тип цієї змінної в консоль.
// Створіть змінну, яка зберігає число "10" і додайте до нього рядок "20". Виведіть результат і його тип.

const nameCharacter = "Petro";
let ageCharacter = 24;
let num = 10 + "hey";
console.log(nameCharacter, ageCharacter, typeof num);
// Створіть об'єкт, який представляє книгу з властивостями title, author та year.
// Додайте нову властивість genre до об'єкта книги.
// Видаліть властивість year з об'єкта книги.
const book = { title: "Kobzar", author: "Taras Shevchenko", year: 1840 };
book.genre = "poetry";
delete book.year;
console.log(book);
// Напишіть функцію, яка приймає два числа і повертає їх суму.
// Напишіть функцію, яка приймає рядок і повертає його в верхньому регістрі.
// Напишіть функцію, яка приймає масив чисел і повертає новий масив з квадратами цих чисел.
function sum(a, b) {
  return a + b;
}
console.log(sum(2, 5));

function toUpCase(str) {
  return str.toUpperCase();
}
console.log(toUpCase("asafsa"));

function abs(arr) {
  return arr.map((v) => v * v);
}
console.log(abs([2, 3, 4, 5, 67]));

// Створіть масив з трьох імен. Додайте нове ім'я до кінця масиву і виведіть його.
// Видаліть перший елемент масиву і виведіть його.
// Знайдіть індекс елемента зі значенням "John" в масиві ["Mike", "John", "Sara"].
const arr = ["Mike", "John", "Sara"];
arr.push("Hanry");
arr.shift();
console.log(
  arr,
  arr.findIndex((i) => i == "John")
);

// Створіть проміс, який резолвиться через 2 секунди з повідомленням "Promise resolved!".
// Використовуйте then для виведення повідомлення, коли проміс буде резолвлено.
// Створіть проміс, який відхиляється з помилкою "Promise rejected!" та обробіть цю помилку за допомогою catch.
let prom = new Promise(function (resolve, reject) {
  setTimeout(() => resolve("Promise resolved!"), 2000);
  // reject(new Error("promise rejected"));
});
prom
  .then((result) => console.log(result))
  .catch((error) => console.log(error.message));
// Створіть асинхронну функцію, яка повертає "Hello, World!" через 1 секунду.
// Викличте цю функцію і виведіть результат в консоль.
// Використовуйте try/catch для обробки помилки в асинхронній функції, яка кидає помилку.
async function sayHello() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("hello world");
    }, 1000);
  });
}
async function execute() {
  try {
    console.log(await sayHello());
  } catch (error) {
    console.log(error);
  }
}
execute();
