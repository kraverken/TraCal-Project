// Storage Controller
const StorageCtrl = (function () {
  return {
    storeItem: function (item) {
      let items;
      // Check if items in localStorage
      if (localStorage.getItem("items") === null) {
        items = [];
        // Push new Item
        items.push(item);
        // set LS
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // render whats already there in LS
        items = JSON.parse(localStorage.getItem("items"));
        // push new item
        items.push(item);
        // Re set LS
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsfromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach(function (item, index) {
        if (updatedItem.id == item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemfromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach(function (item, index) {
        if (id == item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsfromStorage: function () {
      localStorage.removeItem("items");
    },
  };
})();

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //   Data Structure / State
  const state = {
    // items: [
    //   //   { id: 0, name: "Steak Dinner", calories: 1200 },
    //   //   { id: 0, name: "Choochies", calories: 400 },
    //   //   { id: 0, name: "Ande", calories: 300 },
    // ],
    items: StorageCtrl.getItemsfromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  // Public methods
  return {
    logData: function () {
      return state;
    },

    getItems: function () {
      return state.items;
    },

    addItem: function (name, calories) {
      let ID;
      // Create ID
      if (state.items.length > 0) {
        ID = state.items[state.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      //   Calories to number
      calories = parseInt(calories);
      //   Create new Item
      newItem = new Item(ID, name, calories);
      //   Add to items Array
      state.items.push(newItem);
      return newItem;
    },

    getTotalCalories: function () {
      let total = 0;
      //   Loop thru items to add up the calories
      state.items.forEach(function (item) {
        total += item.calories;
      });
      //   Set total calories in State
      state.totalCalories = total;

      //   return total
      return state.totalCalories;
    },

    getItembyID: function (id) {
      let found = null;
      // loop thru items
      state.items.forEach(function (item) {
        if (item.id == id) {
          found = item;
        }
      });
      return found;
    },

    // update item
    updateItem: function (name, calories) {
      calories = parseInt(calories);
      let found = null;
      state.items.forEach(function (item) {
        if (item.id == state.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    // delete item
    deleteItem: function (id) {
      // Get ids
      const Ids = state.items.map(function (item) {
        return item.id;
      });

      // Get Index
      const index = Ids.indexOf(id);

      // Remove item
      state.items.splice(index, 1);
    },

    clearAllItems: function () {
      state.items = [];
    },

    setCurrentitem: function (item) {
      state.currentItem = item;
    },

    getCurrentItem: function () {
      return state.currentItem;
    },
  };
})();

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };

  return {
    populateItemList: function (items) {
      let output = ``;
      items.forEach(function (item) {
        output += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa-solid fa-square-pen"></i>
        </a>
      </li>`;
      });
      //   Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = output;
    },

    getSelectors: function () {
      return UISelectors;
    },

    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },

    showTotalCalories: function (total) {
      document.querySelector(UISelectors.totalCalories).textContent = total;
    },

    addListItem: function (item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create li element
      const li = document.createElement("li");
      //   Add class
      li.className = "collection-item";
      //   Add ID
      li.id = `item-${item.id}`;
      //   Add html
      li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
    <a href="#" class="secondary-content">
      <i class="edit-item fa-solid fa-square-pen"></i>
    </a>`;
      // insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },

    // Updated item to UI
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa-solid fa-square-pen"></i>
          </a>`;
        }
      });
    },

    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    removeItems: function () {
      let listitems = document.querySelectorAll(UISelectors.listItems);

      // Nodelist to array
      listitems = Array.from(listitems);

      listitems.forEach(function (item) {
        item.remove();
      });
    },

    addItemtoForm: function () {
      document.querySelector(UISelectors.itemNameInput).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },

    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },

    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },

    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
  };
})();

// App Controller
const AppCtrl = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // Load Event Listners
  const loadEventListners = function () {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable submit on enter
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 31 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateClick);

    // delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteClick);

    // Back btn event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", (e) => {
        UICtrl.clearEditState();
        e.preventDefault();
      });

    // Clear All btn event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllClick);
  };

  //   Add item function
  const itemAddSubmit = (e) => {
    // Get form input from UI COntroller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if (input.name.trim() !== "" && input.calories.trim() !== "") {
      //Add new item(to array)
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //Add item to UI(list)
      UICtrl.addListItem(newItem);

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Adding to localstorage
      StorageCtrl.storeItem(newItem);

      //Clear fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  };

  // Click Edit Item
  const itemEditClick = (e) => {
    if (e.target.classList.contains("edit-item")) {
      // Have to do this as the list items are not already loaded they come dynamically therefore event delegation

      // get list item id
      const listID = e.target.parentNode.parentNode.id;

      // getting only the id number and storing to array
      const listIdArr = listID.split("-");
      const id = parseInt(listIdArr[1]);

      // get whole item
      const itemToEdit = ItemCtrl.getItembyID(id);

      // Set current item
      ItemCtrl.setCurrentitem(itemToEdit);

      // Add item to form
      UICtrl.addItemtoForm();
    }
    e.preventDefault();
  };

  // item update click
  const itemUpdateClick = (e) => {
    // get item input
    const input = UICtrl.getItemInput();

    // update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update Ui
    UICtrl.updateListItem(updatedItem);

    //   Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update local Storage
    StorageCtrl.updateItemStorage(updatedItem);

    // Clear Edit state
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // item Delete Click
  const itemDeleteClick = function (e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from state
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    //   Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // delete from local Storage
    StorageCtrl.deleteItemfromStorage(currentItem.id);

    // Clear Edit state
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Clear All Click
  const clearAllClick = function (e) {
    // Delete all items from state
    ItemCtrl.clearAllItems();

    //   Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // remove all items from UI
    UICtrl.removeItems();

    // Clear items from storage
    StorageCtrl.clearItemsfromStorage();

    // hide list
    UICtrl.hideList();

    e.preventDefault();
  };

  //   Public Methods->
  return {
    init: function () {
      // set initial state
      UICtrl.clearEditState();

      // Fetch item from State
      const items = ItemCtrl.getItems();

      //   Check if items present
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //   Populate list with items
        UICtrl.populateItemList(items);
      }

      //   Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //   loadEventListners
      loadEventListners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// Initializing App
AppCtrl.init();
