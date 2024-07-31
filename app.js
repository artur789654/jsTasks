class Player {
  constructor(name) {
    this.name = name;
    this.health = 100;
    this.strength = 15;
    this.potions = [];
    this.maxPotions = 10;
    this.level = 1;
    this.inventory = [];
    this.maxInventory = 5;
  }

  attack(monster) {
    const damage = Math.floor(Math.random() * this.strength) + 1;
    monster.health -= damage;
    return damage;
  }

  levelUp() {
    this.level++;
    this.strength += 15;
    this.health += 30;
  }

  addItemOrPotion(item) {
    if (item.type === "potion") {
      if (this.potions.length < this.maxPotions) {
        this.potions.push(item);
        return true;
      }
    } else {
      if (this.inventory.length < this.maxInventory) {
        this.inventory.push(item);
        return true;
      }
    }
    return false;
  }

  useItemOrPotion(itemName) {
    const itemIndex = this.inventory.findIndex(
      (item) => item.name.toLowerCase() === itemName.toLowerCase()
    );
    if (itemIndex !== -1) {
      const item = this.inventory[itemIndex];
      item.use(this);
      this.inventory.splice(itemIndex, 1);
      return true;
    }

    const potionIndex = this.potions.findIndex(
      (potion) => potion.name.toLowerCase() === itemName.toLowerCase()
    );
    if (potionIndex !== -1) {
      const potion = this.potions[potionIndex];
      potion.use(this);
      this.potions.splice(potionIndex, 1);
      return true;
    }
    return false;
  }
}

class Item {
  constructor(name, type, effect) {
    this.name = name;
    this.type = type;
    this.effect = effect;
  }

  use(player) {
    if (this.type === "potion") {
      player.health += this.effect;
      logBattle(
        `${player.name} used ${this.name} and restoring his health by ${this.effect}hp.\n`
      );
    }
    if (this.type === "weapon") {
      player.strength += this.effect;
      logBattle(
        `${player.name} used ${this.name} and increasing his power by ${this.effect}srt.\n`
      );
    }
    if (this.type === "armor") {
      player.health += this.effect;
      logBattle(
        `${player.name} uses ${this.name}, increasing his health by ${this.effect}hp.\n`
      );
    }
  }
}

class Monster {
  constructor(type, health, strength, levelMultiplayer = 1) {
    this.type = type;
    this.baseHealth = health;
    this.baseStrength = strength;
    this.levelMultiplayer = levelMultiplayer;
    this.health = this.baseHealth * this.levelMultiplayer;
    this.strength = this.baseStrength * this.levelMultiplayer;
  }

  attack(player) {
    const damage = Math.floor(Math.random() * this.strength) + 1;
    player.health -= damage;
    return damage;
  }

  updateLevel(level) {
    this.levelMultiplayer = 1 + (level - 1) * 0.5;
    this.health = Math.max(
      Math.floor(this.baseHealth * this.levelMultiplayer),
      0
    );
    this.strength = Math.max(
      Math.floor(this.baseStrength * this.levelMultiplayer),
      0
    );
  }
}

const player = new Player("Human");
const medicalKit = new Item("Medical Kit", "potion", 25);
player.addItemOrPotion(medicalKit);

const monsters = [
  new Monster("Snake", 25, 8),
  new Monster("Wolf", 80, 20),
  new Monster("Chicken", 10, 2),
  new Monster("Duck", 15, 3),
  new Monster("Fox", 40, 12),
  new Monster("Hyena", 30, 15),
  new Monster("Bear", 140, 40),
  new Monster("Lion", 120, 60),
  new Monster("Crocodile", 130, 70),
];

const items = [
  new Item("Stick", "weapon", 5),
  new Item("Bow", "weapon", 15),
  new Item("Shield", "armor", 15),
  new Item("Beer", "potion", 10),
  new Item("Gun", "weapon", 20),
  new Item("Bandage", "potion", 5),
  new Item("Medical kit", "potion", 25),
  new Item("Shoes", "armor", 5),
  new Item("Kevlar", "armor", 30),
];

const playerNameEl = document.getElementById("player-name");
const playerHealthEl = document.getElementById("player-health");
const playerStrengthEl = document.getElementById("player-strength");
const playerPotionsEl = document.getElementById("player-potions");
const playerLevelEl = document.getElementById("player-level");
const playerInventoryEl = document.getElementById("player-inventory");

const monsterTypeEl = document.getElementById("monster-type");
const monsterHealthEl = document.getElementById("monster-health");
const monsterStrengthEl = document.getElementById("monster-strength");

const battleLogEl = document.getElementById("battle-log");

let currentMonster = null;

const updateUI = () => {
  playerNameEl.textContent = player.name;
  playerHealthEl.textContent = player.health;
  playerStrengthEl.textContent = player.strength;
  playerPotionsEl.textContent = player.potions
    .map((potion) => potion.name)
    .join(", ");
  playerLevelEl.textContent = player.level;
  playerInventoryEl.textContent = player.inventory
    .map((item) => item.name)
    .join(", ");

  if (currentMonster) {
    monsterTypeEl.textContent = currentMonster.type;
    monsterHealthEl.textContent = currentMonster.health;
    monsterStrengthEl.textContent = currentMonster.strength;
  }
};

const logBattle = (message) => {
  battleLogEl.textContent += message;
  battleLogEl.scrollTop = battleLogEl.scrollHeight;
};

const startGame = () => {
  currentMonster = monsters[Math.floor(Math.random() * monsters.length)];
  currentMonster.updateLevel(player.level);

  const foundItem = items[Math.floor(Math.random() * items.length)];
  if (player.addItemOrPotion(foundItem)) {
    if (foundItem.type === "potion") {
      logBattle(
        `${player.name} found ${foundItem.name} and added to potions\n`
      );
    } else {
      logBattle(
        `${player.name} found ${foundItem.name} and added to inventory\n`
      );
    }
  } else {
    logBattle(
      `${player.name} can't add this ${foundItem.name} because invetory or potions are full.\n`
    );
  }
  updateUI();
};

const battle = (player, monster) => {
  let battleLog = "";

  while (player.health > 0 && monster.health > 0) {
    const playerDamage = player.attack(monster);
    battleLog += `${player.name} attacks ${monster.type} and deals ${playerDamage} damage.\n`;
    if (monster.health <= 0) {
      player.levelUp();
      monster.health = 0;
      battleLog += `${player.name} defeaded ${monster.type}.\n`;
      return battleLog;
    }

    const monsterDamage = monster.attack(player);
    battleLog += `${monster.type} attacks ${player.name} and deals ${monsterDamage} damage.\n`;
    if (player.health <= 0) {
      player.health = 0;
      battleLog += `${player.name} is defeated.\n`;
      return battleLog;
    }
  }
};

const attackBtn = document.getElementById("attack-button");
const useItemHealBtn = document.getElementById("use-item-or-heal-button");
const reloadBtn = document.getElementById("reload-button");

attackBtn.addEventListener("click", () => {
  const battleRes = battle(player, currentMonster);
  logBattle(battleRes);
  updateUI();
  if (player.health <= 0) {
    attackBtn.disabled = true;
    useItemHealBtn.disabled = true;
    alert("Game over!");
  } else {
    alert(`Your win! Your level is ${player.level} and go you to next level`);
    startGame();
  }
});

useItemHealBtn.addEventListener("click", () => {
  const itemToUse = prompt("Enter name of item or potion you want to use");
  if (itemToUse && player.useItemOrPotion(itemToUse)) {
    logBattle(`${player.name} used ${itemToUse}.\n`);
  } else {
    logBattle("This item is not found in inventory\n");
  }
  updateUI();
});

reloadBtn.addEventListener("click", () => {
  attackBtn.disabled = false;
  useItemHealBtn.disabled = false;
  location.reload();
});

startGame();
