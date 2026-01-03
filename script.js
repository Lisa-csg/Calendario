import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDeP2rZLxm4KI8dpAbSWpvwXghzbQct9oI",
  authDomain: "calendario-interattivo.firebaseapp.com",
  projectId: "calendario-interattivo",
  storageBucket: "calendario-interattivo.appspot.com",
  messagingSenderId: "1020557037064",
  appId: "1:1020557037064:web:6ff81f770f3de724098bbd",
  measurementId: "G-ZEMDFD3PMX",
  databaseURL: "https://calendario-interattivo-9e639-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const giorni = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
const mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", 
              "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

let currentDate = new Date();

function salva(data, tipo, stato) {
  const anno = data.getFullYear();
  const mese = data.getMonth();
  const giorno = data.getDate();
  const dataRef = ref(database, `calendar/${anno}/${mese}/${giorno}/${tipo}`);
  set(dataRef, { checked: stato })
    .then(() => {
      document.getElementById('status').textContent = `✓ ${tipo} salvato`;
      setTimeout(() => document.getElementById('status').textContent = '', 2000);
    })
    .catch(err => {
      document.getElementById('status').textContent = `✗ Errore: ${err.message}`;
    });
}

function carica(data, tipo, callback) {
  const anno = data.getFullYear();
  const mese = data.getMonth();
  const giorno = data.getDate();
  const dataRef = ref(database, `calendar/${anno}/${mese}/${giorno}/${tipo}`);
  onValue(dataRef, snapshot => {
    const val = snapshot.val();
    callback(val ? val.checked : false);
  });
}

function aggiornaUI() {
  document.getElementById('year').textContent = currentDate.getFullYear();
  document.getElementById('monthName').textContent = mesi[currentDate.getMonth()];
  document.getElementById('dayNumber').textContent = currentDate.getDate();
  document.getElementById('dayName').textContent = giorni[currentDate.getDay()];

  carica(currentDate, 'Gatti', checked => {
    document.getElementById('btnGatti').classList.toggle('checked', checked);
  });

  carica(currentDate, 'Galline', checked => {
    document.getElementById('btnGalline').classList.toggle('checked', checked);
  });
}

document.getElementById('btnGatti').addEventListener('click', e => {
  const btn = e.currentTarget;
  const nuovoStato = !btn.classList.contains('checked');
  salva(currentDate, 'Gatti', nuovoStato);
  btn.classList.toggle('checked', nuovoStato);
});

document.getElementById('btnGalline').addEventListener('click', e => {
  const btn = e.currentTarget;
  const nuovoStato = !btn.classList.contains('checked');
  salva(currentDate, 'Galline', nuovoStato);
  btn.classList.toggle('checked', nuovoStato);
});

document.getElementById('btnPrev').addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() - 1);
  aggiornaUI();
});

document.getElementById('btnNext').addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() + 1);
  aggiornaUI();
});

document.getElementById('btnToday').addEventListener('click', () => {
  currentDate = new Date();
  aggiornaUI();
});

aggiornaUI();