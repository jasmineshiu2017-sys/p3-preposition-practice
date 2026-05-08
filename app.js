import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcCMrpl1V8pQmU20YeH_z4i-1jJvcp4c0",
  authDomain: "primary3-8be57.firebaseapp.com",
  projectId: "primary3-8be57",
  storageBucket: "primary3-8be57.firebasestorage.app",
  messagingSenderId: "651460525186",
  appId: "1:651460525186:web:9b64d2f933563efe4e089b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const templates = [
  { source: "Supp 8 Part B", sentence: "Lots of people all ___ the world celebrate the sun.", answer: "over" },
  { source: "Supp 8 Part B", sentence: "The children wear a candle wreath ___ their head.", answer: "on" },
  { source: "Supp 8 Part B", sentence: "Best ___ all, we danced together.", answer: "of" },
  { source: "Supp 8 Part B", sentence: "We danced ___ music at the party.", answer: "to" },
  { source: "Supp 8 Part B", sentence: "___ Sweden, the festival happens in June.", answer: "in" },
  { source: "Supp 8 Part B", sentence: "The midsummer festival happens ___ June.", answer: "in" },
  { source: "Supp 8 Part B", sentence: "People can forget ___ the cold winter.", answer: "about" },
  { source: "Supp 8 Part B", sentence: "The Day of the Dead is a time ___ fun.", answer: "for" },
  { source: "Supp 8 Part B", sentence: "Thousands of bright lanterns go up ___ the sky.", answer: "into" },
  { source: "Supp 8 Part B", sentence: "People celebrate it ___ the beginning of November.", answer: "at" },
  { source: "Supp 8 Part B", sentence: "People celebrate it at the beginning ___ November.", answer: "of" },
  { source: "Supp 8 Part B", sentence: "I dressed up ___ my favourite costume.", answer: "in" },
  { source: "Supp 8 Part B", sentence: "Children all ___ the city enjoy the festival.", answer: "over" },
  { source: "Supp 8 Part B", sentence: "The lanterns went up ___ the night sky.", answer: "into" },
  { source: "Supp 8 Part B", sentence: "We dressed up ___ masks for the parade.", answer: "in" },
  { source: "Supp 8 Part B", sentence: "They sang and danced ___ music.", answer: "to" },
  { source: "Supp 8 Part B", sentence: "The party was a time ___ happy celebrations.", answer: "for" },
  { source: "Supp 8 Part B", sentence: "The children put decorations ___ their heads.", answer: "on" },
  { source: "Supp 8 Part B", sentence: "The festival happens ___ winter.", answer: "in" },
  { source: "Supp 8 Part B", sentence: "Best ___ all, the food was delicious.", answer: "of" },
  { source: "Supp 9 Part B", sentence: "We did not go ___ a picnic because it was raining.", answer: "on" },
  { source: "Supp 9 Part B", sentence: "We went ___ a trip to the museum.", answer: "on" },
  { source: "Supp 9 Part B", sentence: "___ my spare time I like having fun.", answer: "in" },
  { source: "Supp 9 Part B", sentence: "Are these dinosaurs escaping ___ a museum?", answer: "from" },
  { source: "Supp 9 Part B", sentence: "You can learn ___ the stars in the planetarium.", answer: "about" },
  { source: "Supp 9 Part B", sentence: "They are great places to visit ___ the weekend.", answer: "at" },
  { source: "Supp 9 Part B", sentence: "Some museums teach us ___ science.", answer: "about" },
  { source: "Supp 9 Part B", sentence: "People can watch exciting films ___ planets and stars.", answer: "about" },
  { source: "Supp 9 Part B", sentence: "We watched a film ___ the planetarium.", answer: "at" },
  { source: "Supp 9 Part B", sentence: "The California Academy of Sciences is ___ San Francisco, USA.", answer: "in" },
  { source: "Supp 9 Part B", sentence: "Danny and his friends were ___ the planetarium.", answer: "at" },
  { source: "Supp 9 Part B", sentence: "The planetarium was ___ New York City.", answer: "in" },
  { source: "Supp 9 Part B", sentence: "It was a fun place to visit ___ their spare time.", answer: "in" },
  { source: "Supp 9 Part B", sentence: "There were many exciting things for the boys to learn ___ there.", answer: "about" },
  { source: "Supp 9 Part B", sentence: "The interactive programs could teach them ___ stars and planets.", answer: "about" },
  { source: "Supp 9 Part B", sentence: "The pupils learned ___ space at the museum.", answer: "about" },
  { source: "Supp 9 Part B", sentence: "The children arrived ___ the planetarium before lunch.", answer: "at" },
  { source: "Supp 9 Part B", sentence: "A model dinosaur escaped ___ the display area.", answer: "from" },
  { source: "Supp 9 Part B", sentence: "We enjoy visiting museums ___ the weekend.", answer: "at" },
  { source: "Supp 9 Part B", sentence: "The science centre is ___ Hong Kong.", answer: "in" }
];

function buildExpandedPool() {
  const pool = [...templates];
  const add = (source, answer, sentences) => {
    sentences.forEach(sentence => pool.push({ source, answer, sentence }));
  };

  add("Supp 8 Part B", "over", [
    "Children all ___ the city enjoy the festival.",
    "Families all ___ the town watched the parade.",
    "People all ___ the country celebrated together.",
    "Lanterns were seen all ___ the island.",
    "Decorations were put up all ___ the school.",
    "Songs were heard all ___ the playground.",
    "Flags were hanging all ___ the village.",
    "The news spread all ___ the world."
  ]);
  add("Supp 8 Part B", "on", [
    "The girl wore flowers ___ her head.",
    "The boy put a paper crown ___ his head.",
    "The children carried baskets ___ their heads.",
    "She wore a bright wreath ___ her head.",
    "He placed a mask ___ his head.",
    "The dancer balanced a hat ___ her head.",
    "They wore candles ___ their heads.",
    "The child had a scarf ___ his head."
  ]);
  add("Supp 8 Part B", "of", [
    "Best ___ all, the parade was free.",
    "Best ___ all, the lanterns were beautiful.",
    "Best ___ all, our class sang a song.",
    "Best ___ all, we had delicious food.",
    "At the beginning ___ June, the weather was warm.",
    "At the beginning ___ the show, everyone clapped.",
    "At the beginning ___ the festival, we took photos.",
    "At the beginning ___ the party, Mum gave us masks."
  ]);
  add("Supp 8 Part B", "to", [
    "We listened ___ music at the festival.",
    "The children danced ___ music in the hall.",
    "They sang ___ the music happily.",
    "We clapped ___ the music.",
    "The class danced ___ a fast song.",
    "The dancers moved ___ the drum beat.",
    "The children marched ___ music in the parade.",
    "Everyone danced ___ the festival song."
  ]);
  add("Supp 8 Part B", "in", [
    "___ Sweden, children celebrate midsummer.",
    "___ Mexico, families celebrate the Day of the Dead.",
    "___ winter, the nights are cold and dark.",
    "___ summer, people enjoy outdoor parties.",
    "The festival happens ___ June.",
    "The parade happens ___ November.",
    "I dressed up ___ a scary costume.",
    "She dressed up ___ a bright red dress."
  ]);
  add("Supp 8 Part B", "about", [
    "People can forget ___ the cold winter.",
    "The children forgot ___ their homework during the party.",
    "We talked ___ the festival after class.",
    "Dad told us ___ the parade.",
    "Our teacher taught us ___ different festivals.",
    "The story was ___ a wonderful celebration.",
    "We learned ___ lantern festivals.",
    "Mum read a book ___ the Day of the Dead."
  ]);
  add("Supp 8 Part B", "for", [
    "The festival is a time ___ fun.",
    "The party is a time ___ happy celebrations.",
    "The parade is a time ___ singing and dancing.",
    "The holiday is a time ___ families.",
    "We made decorations ___ the party.",
    "Mum bought candles ___ the festival.",
    "The hall was ready ___ the celebration.",
    "We wore costumes ___ fun."
  ]);
  add("Supp 8 Part B", "into", [
    "Lanterns went up ___ the sky.",
    "Balloons floated ___ the blue sky.",
    "The children walked ___ the hall.",
    "The parade moved ___ the town square.",
    "Smoke went up ___ the air.",
    "We ran ___ the classroom after recess.",
    "The dancers came ___ the playground.",
    "The bright lights shone ___ the dark sky."
  ]);
  add("Supp 8 Part B", "at", [
    "People celebrate it ___ the beginning of November.",
    "We met ___ the beginning of the parade.",
    "The show started ___ seven o'clock.",
    "We arrived ___ the school hall.",
    "The children waited ___ the gate.",
    "The class sang ___ the party.",
    "We took photos ___ the festival.",
    "The fireworks started ___ night."
  ]);
  add("Supp 9 Part B", "on", [
    "We went ___ a picnic after school.",
    "Our class went ___ a trip to the museum.",
    "Danny went ___ a visit to the planetarium.",
    "They went ___ a tour of the science centre.",
    "We went ___ an outing last Saturday.",
    "The family went ___ a walk in the park.",
    "The boys went ___ a short trip.",
    "We did not go ___ a picnic because it rained."
  ]);
  add("Supp 9 Part B", "in", [
    "___ my spare time I read books.",
    "___ my spare time I like having fun.",
    "The museum is ___ New York City.",
    "The academy is ___ San Francisco.",
    "The planetarium is ___ the city centre.",
    "The children played ___ the classroom.",
    "Danny lives ___ Hong Kong.",
    "The film started ___ the afternoon."
  ]);
  add("Supp 9 Part B", "from", [
    "Are these dinosaurs escaping ___ a museum?",
    "The model dinosaur fell ___ the shelf.",
    "The pupils came ___ school to visit the museum.",
    "The children walked ___ the bus stop to the planetarium.",
    "Light came ___ the big screen.",
    "The boys returned ___ the science centre.",
    "A loud sound came ___ the theatre.",
    "Danny borrowed a book ___ the library."
  ]);
  add("Supp 9 Part B", "about", [
    "You can learn ___ the stars in the planetarium.",
    "Some museums teach us ___ science.",
    "People can watch films ___ planets and stars.",
    "The guide talked ___ the moon.",
    "We learned ___ dinosaurs at the museum.",
    "The program taught us ___ space.",
    "The book was ___ famous scientists.",
    "The children asked questions ___ the sun."
  ]);
  add("Supp 9 Part B", "at", [
    "They are great places to visit ___ the weekend.",
    "We watched a film ___ the planetarium.",
    "Danny and his friends were ___ the planetarium.",
    "The children arrived ___ the museum early.",
    "We met ___ the front door.",
    "The show began ___ the weekend.",
    "The boys waited ___ the ticket counter.",
    "The class ate lunch ___ the science centre."
  ]);

  const unique = new Map();
  pool.forEach(item => unique.set(`${item.sentence}|${item.answer}`, item));
  return [...unique.values()];
}

const els = {
  studentTab: document.querySelector("#studentTab"),
  parentTab: document.querySelector("#parentTab"),
  studentView: document.querySelector("#studentView"),
  parentView: document.querySelector("#parentView"),
  startPanel: document.querySelector("#startPanel"),
  quizPanel: document.querySelector("#quizPanel"),
  resultPanel: document.querySelector("#resultPanel"),
  studentName: document.querySelector("#studentName"),
  studentClass: document.querySelector("#studentClass"),
  startBtn: document.querySelector("#startBtn"),
  pageTitle: document.querySelector("#pageTitle"),
  progressText: document.querySelector("#progressText"),
  liveScore: document.querySelector("#liveScore"),
  progressBar: document.querySelector("#progressBar"),
  questionList: document.querySelector("#questionList"),
  pageFeedback: document.querySelector("#pageFeedback"),
  prevBtn: document.querySelector("#prevBtn"),
  checkBtn: document.querySelector("#checkBtn"),
  nextBtn: document.querySelector("#nextBtn"),
  finishBtn: document.querySelector("#finishBtn"),
  finalCorrect: document.querySelector("#finalCorrect"),
  finalWrong: document.querySelector("#finalWrong"),
  finalPercent: document.querySelector("#finalPercent"),
  saveStatus: document.querySelector("#saveStatus"),
  restartBtn: document.querySelector("#restartBtn"),
  parentLoginBtn: document.querySelector("#parentLoginBtn"),
  parentLogoutBtn: document.querySelector("#parentLogoutBtn"),
  parentStatus: document.querySelector("#parentStatus"),
  summaryCards: document.querySelector("#summaryCards"),
  attemptTable: document.querySelector("#attemptTable"),
  attemptRows: document.querySelector("#attemptRows"),
  totalAttempts: document.querySelector("#totalAttempts"),
  avgScore: document.querySelector("#avgScore"),
  latestScore: document.querySelector("#latestScore")
};

let state = {
  questions: [],
  page: 0,
  student: { name: "", className: "" }
};

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeQuestionSet() {
  const pool = shuffle(buildExpandedPool());
  return pool.slice(0, 100).map((base, i) => ({
      ...base,
      id: `${Date.now()}-${i}-${Math.random().toString(16).slice(2)}`,
      userAnswer: "",
      checked: false,
      correct: false
    }));
}

function switchView(view) {
  const isStudent = view === "student";
  els.studentView.classList.toggle("active", isStudent);
  els.parentView.classList.toggle("active", !isStudent);
  els.studentTab.classList.toggle("active", isStudent);
  els.parentTab.classList.toggle("active", !isStudent);
}

function renderPage() {
  const start = state.page * 10;
  const pageItems = state.questions.slice(start, start + 10);
  els.pageTitle.textContent = `Page ${state.page + 1} of 10`;
  els.progressText.textContent = `Questions ${start + 1}-${start + pageItems.length}`;
  els.progressBar.style.width = `${(state.page + 1) * 10}%`;
  els.prevBtn.disabled = state.page === 0;
  els.nextBtn.classList.toggle("hidden", state.page === 9);
  els.finishBtn.classList.toggle("hidden", state.page !== 9);
  els.pageFeedback.classList.add("hidden");
  els.questionList.innerHTML = pageItems.map((q, offset) => {
    const index = start + offset;
    const statusClass = q.checked ? (q.correct ? "correct" : "wrong") : "";
    const note = q.checked
      ? (q.correct ? "Correct" : `Wrong. Answer: ${q.answer}`)
      : "";
    return `
      <article class="question ${statusClass}">
        <div class="sentence"><strong>${index + 1}.</strong> ${q.sentence.replace("___", '<span class="blank"></span>')}</div>
        <div class="answer-row">
          <input data-index="${index}" value="${q.userAnswer}" placeholder="Answer">
          <span class="answer-note">${note}</span>
        </div>
        <p class="small">${q.source}</p>
      </article>
    `;
  }).join("");
  syncLiveScore();
}

function syncAnswers() {
  els.questionList.querySelectorAll("input[data-index]").forEach(input => {
    state.questions[Number(input.dataset.index)].userAnswer = input.value;
  });
}

function checkCurrentPage() {
  syncAnswers();
  const start = state.page * 10;
  const pageItems = state.questions.slice(start, start + 10);
  pageItems.forEach(q => {
    q.checked = true;
    q.correct = normalize(q.userAnswer) === normalize(q.answer);
  });
  const correct = pageItems.filter(q => q.correct).length;
  els.pageFeedback.textContent = `This page: ${correct} correct, ${10 - correct} wrong.`;
  els.pageFeedback.classList.remove("hidden");
  renderPage();
  els.pageFeedback.classList.remove("hidden");
}

function syncLiveScore() {
  const correct = state.questions.filter(q => q.checked && q.correct).length;
  els.liveScore.textContent = correct;
}

function resultSummary() {
  syncAnswers();
  state.questions.forEach(q => {
    q.checked = true;
    q.correct = normalize(q.userAnswer) === normalize(q.answer);
  });
  const correct = state.questions.filter(q => q.correct).length;
  return {
    correct,
    wrong: state.questions.length - correct,
    score: Math.round((correct / state.questions.length) * 100)
  };
}

async function finishQuiz() {
  const summary = resultSummary();
  els.quizPanel.classList.add("hidden");
  els.resultPanel.classList.remove("hidden");
  els.finalCorrect.textContent = summary.correct;
  els.finalWrong.textContent = summary.wrong;
  els.finalPercent.textContent = `${summary.score}%`;
  els.saveStatus.textContent = "Saving to Firebase...";

  const payload = {
    studentName: state.student.name,
    studentClass: state.student.className,
    correct: summary.correct,
    wrong: summary.wrong,
    score: summary.score,
    total: 100,
    createdAt: serverTimestamp(),
    questions: state.questions.map(q => ({
      sentence: q.sentence,
      answer: q.answer,
      userAnswer: q.userAnswer,
      correct: q.correct,
      source: q.source
    }))
  };

  try {
    await addDoc(collection(db, "prepositionAttempts"), payload);
    els.saveStatus.textContent = "Saved to Firebase. Parent can view it after logging in.";
  } catch (error) {
    const local = JSON.parse(localStorage.getItem("prepositionAttempts") || "[]");
    local.unshift({ ...payload, createdAtLocal: new Date().toISOString() });
    localStorage.setItem("prepositionAttempts", JSON.stringify(local));
    els.saveStatus.textContent = `Firebase save failed, so this result was saved on this device. ${error.message}`;
  }
}

function startQuiz() {
  const name = els.studentName.value.trim();
  const className = els.studentClass.value.trim();
  if (!name || !className) {
    alert("Please enter student name and class.");
    return;
  }
  state = {
    questions: makeQuestionSet(),
    page: 0,
    student: { name, className }
  };
  els.startPanel.classList.add("hidden");
  els.resultPanel.classList.add("hidden");
  els.quizPanel.classList.remove("hidden");
  renderPage();
}

async function loadAttempts() {
  els.parentStatus.textContent = "Loading Firebase results...";
  try {
    const q = query(collection(db, "prepositionAttempts"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const rows = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderAttempts(rows);
  } catch (error) {
    els.parentStatus.textContent = `Could not load Firebase results. ${error.message}`;
    renderAttempts([]);
  }
}

function renderAttempts(rows) {
  if (!rows.length) {
    els.parentStatus.textContent = "Logged in. No attempts found yet.";
    els.summaryCards.classList.add("hidden");
    els.attemptTable.classList.add("hidden");
    return;
  }
  els.parentStatus.textContent = "Logged in. Results loaded.";
  els.summaryCards.classList.remove("hidden");
  els.attemptTable.classList.remove("hidden");
  const avg = Math.round(rows.reduce((sum, row) => sum + Number(row.score || 0), 0) / rows.length);
  els.totalAttempts.textContent = rows.length;
  els.avgScore.textContent = `${avg}%`;
  els.latestScore.textContent = `${rows[0].score || 0}%`;
  els.attemptRows.innerHTML = rows.map(row => {
    const created = row.createdAt?.toDate ? row.createdAt.toDate() : null;
    const date = created ? created.toLocaleString() : "Just now";
    return `
      <tr>
        <td>${date}</td>
        <td>${row.studentName || ""}</td>
        <td>${row.studentClass || ""}</td>
        <td>${row.correct || 0}</td>
        <td>${row.wrong || 0}</td>
        <td>${row.score || 0}%</td>
      </tr>
    `;
  }).join("");
}

els.studentTab.addEventListener("click", () => switchView("student"));
els.parentTab.addEventListener("click", () => switchView("parent"));
els.startBtn.addEventListener("click", startQuiz);
els.checkBtn.addEventListener("click", checkCurrentPage);
els.prevBtn.addEventListener("click", () => {
  syncAnswers();
  state.page = Math.max(0, state.page - 1);
  renderPage();
});
els.nextBtn.addEventListener("click", () => {
  syncAnswers();
  state.page = Math.min(9, state.page + 1);
  renderPage();
});
els.finishBtn.addEventListener("click", finishQuiz);
els.restartBtn.addEventListener("click", () => {
  els.resultPanel.classList.add("hidden");
  els.startPanel.classList.remove("hidden");
});
els.parentLoginBtn.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    if (error.code === "auth/popup-blocked" || error.code === "auth/cancelled-popup-request") {
      await signInWithRedirect(auth, provider);
      return;
    }
    els.parentStatus.textContent = `Login failed. ${error.message}`;
  }
});
els.parentLogoutBtn.addEventListener("click", () => signOut(auth));

getRedirectResult(auth).catch(error => {
  els.parentStatus.textContent = `Login failed. ${error.message}`;
});

onAuthStateChanged(auth, user => {
  els.parentLoginBtn.classList.toggle("hidden", Boolean(user));
  els.parentLogoutBtn.classList.toggle("hidden", !user);
  if (user) {
    els.parentStatus.textContent = `Logged in as ${user.email}`;
    loadAttempts();
  } else {
    els.parentStatus.textContent = "Not logged in.";
    els.summaryCards.classList.add("hidden");
    els.attemptTable.classList.add("hidden");
  }
});
