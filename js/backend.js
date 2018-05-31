'use strict';
M.AutoInit();
let RadioOrgainzation = document.getElementById('Organization');
let inputName = document.getElementById('inputName');
let inputAddress = document.getElementById('inputAddress');
let inputDate = document.getElementById('inputDate');
let inputPhone = document.getElementById('inputPhone');
let inputEmail = document.getElementById('inputEmail');
let labelAutocomplete = document.getElementById('labelAutocomplete');
let buttonSubmit = document.getElementById('buttonSubmit');
let buttonClear = document.getElementById('buttonClear');
let result = document.querySelector(".result");

let res = [];


let tomorrowsDate = new (Date);
tomorrowsDate.setDate(tomorrowsDate.getDate()+1);
inputDate.value = tomorrowsDate.toLocaleDateString("ru");

function createData() {
  return  {
    isPrivatePerson: null,
    privatePerson: { 
      name: null,
      patronymic: null,
      surname: null
    },
    organization: {
      name: null,
      management: {
        name: null,
        post: null
      },
      INN: null,
      KPP: null
    },
    address: {
      city: null,
      cityDistrict: null,
      cityDistrictType: null,
      cityTypeFull: null,
      houseTypeFull: null,
      house: null,
      flat: null,
      flatType: null,
      flatTypeFull: null,
      postalCode: null,
      region: null,
      regionTypeFull: null,
      street: null,
      streetTypeFull: null
    },
    phone: null,
    email: null,
    date: null
  }
}

let data = createData();

function dataAddressFill(data, suggestion) {
  try {
    data.address.city = suggestion.data.city;
    data.address.cityDistrict = suggestion.data.city_district;
    data.address.cityDistrictType = suggestion.data.city_district_type;
    data.address.cityTypeFull = suggestion.data.city_type_full;
    data.address.house = suggestion.data.house;
    data.address.houseTypeFull = suggestion.data.house_type_full;
    data.address.flat = suggestion.data.flat;
    data.address.flatType = suggestion.data.flat_type;
    data.address.flatTypeFull = suggestion.data.flat_type_full;
    data.address.postalCode = suggestion.data.postal_code;
    data.address.region = suggestion.data.region;
    data.address.regionTypeFull = suggestion.data.region_type_full;
    data.address.street = suggestion.data.street;
    data.address.streetTypeFull = suggestion.data.street_type_full;
  } catch (err) { console.log(err) };
}

function dataHandler (suggestion, type) {
  if (type === "NAME") {
    data.isPrivatePerson = true;
    data.privatePerson.name = suggestion.data.name;
    data.privatePerson.patronymic = suggestion.data.patronymic;
    data.privatePerson.surname = suggestion.data.surname;
  } else
  if (type === "PARTY") {
    try {
      inputAddress.value = suggestion.data.address.value;
      data.organization.name = suggestion.value;
      dataAddressFill(data, suggestion.data.address);
      data.organization.management.name = suggestion.data.management.name;
      data.organization.management.post = suggestion.data.management.post;
      data.organization.INN = suggestion.data.inn;
      data.organization.KPP = suggestion.data.kpp; } catch(err) { console.log(err) };
    } else
  if (type === "ADDRESS") {
    dataAddressFill(data, suggestion);
  }
}

$("#inputName").suggestions({
  token: "1a4b5914c3fb27457734ab467410dfc667121c2c",
  type: "NAME",
  count: 5,
  onSelect: function(suggestion) {
    dataHandler(suggestion, "NAME");
  }
}); 

$("#inputAddress").suggestions({
  token: "1a4b5914c3fb27457734ab467410dfc667121c2c",
  type: "ADDRESS",
  count: 5,
  onSelect: function(suggestion) {
    dataHandler(suggestion, "ADDRESS");
  }
});

inputPhone.addEventListener("focus", function(evt) {
  if (inputPhone.value === "") {
    inputPhone.value = "+7 ("
  }
});

inputPhone.addEventListener('keydown', function(evt) {
   if ((evt.keyCode < 48 || evt.keyCode > 57) &&
       (evt.keyCode < 37 || evt.keyCode > 40) &&
       (evt.keyCode < 96 || evt.keyCode > 105) &&
        evt.keyCode != 8 && evt.keyCode != 9 && evt.keyCode != 13 && evt.keyCode != 27 && evt.keyCode != 116) evt.preventDefault();
})

inputPhone.addEventListener("input", function(evt) {
  if (evt.inputType === "insertText" && evt.data >=0 && evt.data <=9) {
    if (evt.target.value.length === 1) {
      inputPhone.value = "+7 (" + evt.data;
    }
    if (evt.target.value.length === 7) {
      inputPhone.value += ') '
    } else
    if (evt.target.value.length === 12 || evt.target.value.length === 15) {
      inputPhone.value += '-'
    } else
    if (evt.target.value.length > 18) {
      inputPhone.value = inputPhone.value.substring(0, 18);
    }
  } else 
    if ((evt.inputType === "deleteContentBackward") && (evt.path[0].value.length < 4)) {
      evt.preventDefault();
      inputPhone.value = "+7 (";
    }
  });

RadioOrgainzation.addEventListener("change", function (evt) {
  data = createData();
  if (evt.target.checked) {
    labelAutocomplete.innerText = "Наименование организации"
  } else {
    labelAutocomplete.innerText = "Имя, фамилия, может быть отчество";
    inputAddress.value = "";
  }
  $("#inputName").unbind();
  $("#inputName").suggestions({
    token: "1a4b5914c3fb27457734ab467410dfc667121c2c",
    type: (evt.target.checked) ? "PARTY" : "NAME",
    count: 5,
    onSelect: function(suggestion) {
      dataHandler(suggestion, (evt.target.checked) ? "PARTY" : "NAME");
    }
  });
});

function iterate(obj) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] == "object") {
        iterate(obj[property]);
      }
      else {
        res.push(`${property} ${obj[property]}<br>`)
      }
    }
  }
  return(res)
}

buttonSubmit.addEventListener("click", function (evt) {
  data.date = inputDate.value;
  data.phone = inputPhone.value;
  data.email = inputEmail.value;
  let element = document.createElement('div');
  let htmldata = iterate(data, element);
  element.innerHTML = htmldata.join('');
  result.appendChild(element);
});

buttonClear.addEventListener("click", function (evt) {
  inputAddress.value = "";
  inputDate.value = "";
  inputEmail.value = "";
  inputName.value = "";
  inputPhone.value = ""
  if (result.childElementCount > 0) {
    while (result.firstChild) {
      result.removeChild(result.firstChild)
    }
  };
})
