class HotelRoom{
  constructor(num){
    this.num =num;
    this.isBooked = false;
    this.bookedBy = '';
  }

  bookRoom(guestName){
    if(this.isBooked){
      console.log(`This room ${this.num} is booked`)
    }else{
      this.isBooked = true;
      this.bookedBy = guestName;
      console.log(`Room ${this.num} booked by ${guestName}`);
    }
  }

  checkRoomStatus(){
    if(this.isBooked){
      console.log(`This room ${this.num} is booked`)
    }else{
      console.log(`Room ${this.num} is available`)
    }
  }
}

const room1 = new HotelRoom('1');
const room2 = new HotelRoom('12');
const room3 = new HotelRoom('15');

const visitor = 'John Wick';
room1.bookRoom.call(room1, visitor);
room2.bookRoom.apply(room2, ['Adel Smith']);
room3.checkRoomStatus();
const bookedRoom3 =room3.bookRoom.bind(room3);
bookedRoom3('john Cena');
room3.checkRoomStatus();