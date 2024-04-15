const nameParent = document.querySelector('.nameParent');
const parentNumber = document.querySelector('.parentNumber');
const studentName = document.querySelector('.nameChild');
const nameCourse = document.querySelector('.nameCourse');
const formError = document.querySelector('.formError');
const linkGit = document.querySelector('.linkGit')
const notData = 'нет данных';

function updateStudentParent(student) {

  if (student.Agents && student.Agents.length > 0) {
    let agent = student.Agents[0];
    let firstName = agent.FirstName || '';
    let middleName = agent.MiddleName || '';
    let lastName = agent.LastName || '';
    let mobileNumber = agent.Mobile || '';
    let fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
    nameParent.textContent = fullName.trim();
    parentNumber.textContent = mobileNumber;
  } else {
    nameParent.textContent = notData;
  }
}

function updateStudentName(student) {

  if (student) {
    let firstName = student.FirstName || '';
    let lastName = student.LastName || '';
    let fullName = [firstName, lastName].join(' ');
    studentName.textContent = fullName.trim();
  } else {
    studentName.textContent = notData;
  }
}


function updateStudentDisciplines(student) {

  if (student) {
    let discipline = student.Disciplines[0].Discipline || '';
    let level = student.Disciplines[0].Level || '';

    let description = [discipline, level].join(' ');

    nameCourse.textContent = description;
  } else {
    nameCourse.textContent = notData;
  }
}

function updateStudentLink(student) {

  if (student) {
    let link = student.ExtraFields[0].Value || '';

    linkGit.textContent = ' ' + link;
    linkGit.href = link;
  } else {
    linkGit.textContent = notData;
  }
}


function handleResponse(data) {

  console.log(data);

  if (data && data.Students && data.Students.length > 0) {
    updateStudentParent(data.Students[0]);
    updateStudentName(data.Students[0]);
    updateStudentDisciplines(data.Students[0]);
    updateStudentLink(data.Students[0])
  } else {
    formError.textContent = notData;
  }
}

function fetchJSONP(url, callbackName) {
  const script = document.createElement('script');
  script.src = `${url}&callback=${callbackName}`;
  document.body.appendChild(script);
}

const apiUrl = 'https://it-academy.t8s.ru/Api/V2/GetStudents';
const authkey = 'WuLyujCFtTDaxq4MorahbYMnYBsWJa823uwSla62X4olBglySpRyXjTLmLvEMBfW';
const callbackName = 'handleResponse';

const form = document.querySelector('.form');
const input = document.querySelector('.input');

let studentId = null;

input.addEventListener('change', (e) => {
  e.preventDefault();
  studentId = e.target.value;
})

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (parseInt(studentId) < 0) return;

  formError.textContent = '';
  nameParent.textContent = '';

  fetchJSONP(`${apiUrl}?authkey=${encodeURIComponent(authkey)}&Id=${studentId}`, callbackName);
})
