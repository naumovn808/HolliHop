const form = document.querySelector('.form');
const input = document.querySelector('.input');
const nameParent = document.querySelector('.nameParent');
const parentNumber = document.querySelector('.parentNumber');
const studentName = document.querySelector('.nameChild');
const nameCourse = document.querySelector('.nameCourse');
const formError = document.querySelector('.formError');
const linkGit = document.querySelector('.linkGit');
const nameGroup = document.querySelector('.nameGrorup');
const nameTeacher = document.querySelector('.nameTeacher');
const startEndDate = document.querySelector('.start-end-date');
const dateVisit = document.querySelector('.dateVisit');
const commentTeacher = document.querySelector('.comment');
const performance = document.querySelector('.performance');
const btnPdf = document.querySelector('.pdf__btn');
const notData = 'нет данных';

let studentId = null;
let clientId = null;

let beginTimeStudent = null;
let endTimeStudent = null;

let dateFrom = null;
let dateTo = null;

function updateBeginEndTime(student) {
  if (student[0]?.BeginDate) {
    beginTimeStudent = student[0].BeginDate;
    endTimeStudent = student[0].EndDate;

    startEndDate.textContent = `${beginTimeStudent}  -  ${endTimeStudent}`
  } else {
    startEndDate.textContent = notData;
  }

}

function getDays(student) {
  console.log('days', student[0]);
  if (student[0]?.Days) {
    console.log(student[0]?.Days);

    let arr = student[0].Days

    dateVisit.innerHTML = `
    ${arr.map(e => {
      return `<span>${e.Date} - ${e.Pass ? ' пропустил ' : ' посетил '}</span>`
    }).join('')}
    
    `
  }

}

function checkDateRange() {
  const currentDate = new Date();
  const eightDaysAgo = new Date(currentDate.getTime() - 28 * 24 * 60 * 60 * 1000);

  const currentDateStr = currentDate.toISOString().split('T')[0];
  const eightDaysAgoStr = eightDaysAgo.toISOString().split('T')[0];


  if (eightDaysAgoStr >= beginTimeStudent && currentDateStr <= endTimeStudent) {
    dateFrom = eightDaysAgoStr;
    dateTo = currentDateStr;

  }
}

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
    console.log(fullName, mobileNumber);
  }
  else {
    nameParent.textContent = notData;
  }
}

function updateStudentId(student) {
  if (student.ClientId) {
    clientId = student.ClientId;
  } else {
    clientId = null;
  }
}

function updateStudentName(student) {

  if (student) {
    let firstName = student.FirstName || '';
    let lastName = student.LastName || '';
    let fullName = [firstName, lastName].join(' ');
    studentName.textContent = fullName.trim();
    console.log(fullName.trim());
  } else {
    studentName.textContent = notData;
  }
}

function updateStudentDisciplines(student) {

  if (student && student[0]) {

    let discipline = student[0].EdUnitDiscipline;

    nameCourse.textContent = discipline;
    console.log(discipline);
  } else {
    nameCourse.textContent = notData;
  }
}

function updateStudentLink(student) {

  if (student && student.ExtraFields) {
    let link = student.ExtraFields[0].Value || '';

    linkGit.textContent = ' ' + link;
    linkGit.href = link;
    console.log(link);
  } else {
    linkGit.textContent = notData;
  }
}

function updateGroupName(student) {

  if (student && student[0]) {
    let str = student[0].EdUnitName;
    if (str) str = str.replace(/\s+/g, " ").split(' ');

    nameGroup.textContent = str[0];
    nameTeacher.textContent = str[1]?.replace(/\(|\)/g, " ");
    console.log(' имя группы и учителя', str);
  } else {
    nameGroup.textContent = notData;
    nameTeacher.textContent = notData;
  }
}




function handleResponse(data) {


  if (data && data.Students && data.Students.length > 0) {
    updateStudentParent(data.Students[0]);
    updateStudentName(data.Students[0]);

    updateStudentLink(data.Students[0]);
    updateStudentId(data.Students[0]);
  } else {
    formError.textContent = notData;
  }
}

function handleResponse2(data) {
  console.log(data);
  if (data && data.EdUnitStudents && data.EdUnitStudents.length > 0) {
    updateGroupName(data.EdUnitStudents)
    updateStudentDisciplines(data.EdUnitStudents);
    updateBeginEndTime(data.EdUnitStudents);
    checkDateRange();
    console.log(dateFrom, dateTo);
  } else {
    formError.textContent = notData;
  }

}

function handleResponse3(data) {

  console.log(data);
  if (data && data.EdUnitStudents && data.EdUnitStudents.length > 0)
    getDays(data.EdUnitStudents);

}

function handleResponse4(data) {

  if (data && data.EdUnitStudentReports) {
    console.log(data.EdUnitStudentReports[0]);
    commentTeacher.textContent = data.EdUnitStudentReports[0].CommentHtml;
    console.log(data.EdUnitStudentReports[0].Criterions);
    const arrPerformance = data.EdUnitStudentReports[0].Criterions;

    arrPerformance.forEach(item => {
      performance.innerHTML += `${item.CriterionName} - ${item.Value}  <br>`;
    });

  } else {
    commentTeacher.textContent = notData;
    performance = notData;
  }

}

function fetchJSONP(url, callbackName) {
  const script = document.createElement('script');
  script.src = `${url}&callback=${callbackName}`;
  document.body.appendChild(script);
}


input.addEventListener('change', (e) => {
  e.preventDefault();
  studentId = e.target.value;
  e.target.value = '';
})

const apiUrl = 'https://it-academy.t8s.ru/Api/V2/GetStudents';
const apiUrl2 = 'https://it-academy.t8s.ru/Api/V2/GetEdUnitStudents';
const apiUrl3 = 'https://it-academy.t8s.ru/Api/V2/GetEdUnitStudentReports';

const authkey = 'WuLyujCFtTDaxq4MorahbYMnYBsWJa823uwSla62X4olBglySpRyXjTLmLvEMBfW';
const callbackName = 'handleResponse';
const callbackName2 = 'handleResponse2';
const callbackName3 = 'handleResponse3';
const callbackName4 = 'handleResponse4';


form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (parseInt(studentId) < 0) return;

  formError.textContent = '';
  nameParent.textContent = '';
  nameParent.textContent = '';
  parentNumber.textContent = '';
  studentName.textContent = '';
  nameCourse.textContent = '';
  formError.textContent = '';
  linkGit.textContent = '';
  nameGroup.textContent = '';

  fetchJSONP(`${apiUrl}?authkey=${encodeURIComponent(authkey)}&Id=${studentId}`, callbackName);


  setTimeout(() => {
    fetchJSONP(`${apiUrl2}?authkey=${encodeURIComponent(authkey)}&studentClientId=${clientId}`, callbackName2);

    fetchJSONP(`${apiUrl3}?authkey=${encodeURIComponent(authkey)}&studentClientId=${clientId}`, callbackName4);
  }, 1000)

  setTimeout(() => {
    fetchJSONP(`${apiUrl2}?authkey=${encodeURIComponent(authkey)}&studentClientId=${clientId}&queryDays=true&dateFrom=${dateFrom}&dateTo=${dateTo}`, callbackName3);
  }, 3000)

})



// Создание нового документа PDF

function generatePdf() {

  let docDefinition = {
    content: [
      `
    ФИО Ребенка:  ${studentName.textContent}
    ФИО Родителя:   ${nameParent.textContent}
    Номер Родителя:  ${parentNumber.textContent}
    Название курса:  ${nameCourse.textContent}
    Название группы:  ${nameGroup.textContent}
    Кто преподаватель:  ${nameTeacher.textContent}
    Даты последних(планируемых) 8 занятий у ГРУППЫ:  
    дата начала и конца обучения:  ${startEndDate.textContent}
    Ссылка на гитхаб ученика:   ${linkGit.textContent}
    Комментарий преподавателя:  ${commentTeacher.textContent}
    Оценка успеваемости по 8 последним занятиям :   ${performance.textContent}

    Фактические посещения студентом последних 8 занятий
  ${dateVisit.textContent}

    `
    ]
  };

  pdfMake.createPdf(docDefinition).download('data.pdf');
}


btnPdf.addEventListener('click', (e) => {
  e.preventDefault();

  generatePdf();

})




