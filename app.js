class Book {
  constructor(title, author, year) {
    this.title = title;
    this.author = author;
    this.year = year;
  }
  showBook() {
    console.log(`title: ${this.title}, author: ${this.author}`);
  }
}

class EBook extends Book {
  constructor(title, author, year, fileSize) {
    super(title, author, year);
    this.fileSize = fileSize;
  }
  downloadFile() {
    console.log(`Downloading ${this.title} by ${this.author} (${this.fileSize}MB)`);
  }
}

// const myBook = new Book("Kobzar", "Taras Shevchenko", 1840);
// const myEBook = new EBook("Kobzar", "Taras Shevchenko", 1840, 18);
// myBook.showBook();
// myEBook.downloadFile();
// myEBook.showBook();
// function Book(title, author, year) {
//   this.title = title;
//   this.author = author;
//   this.year = year;
// }

// Book.prototype.showBook= function() {
// console.log(`title: ${this.title}, author: ${this.author}`);
// }

// function EBook(title, author, year, fileSize){
//   Book.call(this,title, author, year);
//   this.fileSize= fileSize;
// }
// EBook.prototype = Object.create(Book.prototype); 
// EBook.prototype.constructor = EBook;

// EBook.prototype.downloadFile = function(){
// console.log(`Downloading ${this.title} by ${this.author} (${this.fileSize}MB)`);
// }

// const myBook = new Book("Kobzar", "Taras Shevchenko", 1840);
// const myEBook = new EBook("Kobzar", "Taras Shevchenko", 1840, 18);
// myBook.showBook();
// myEBook.downloadFile();
// myEBook.showBook();
// Класами простіше робити наслідування і напевно краще за новими стандартами)