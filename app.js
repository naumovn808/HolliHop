function handleResponse(data) {
  // Обработка полученных данных
  console.log('Полученные данные:', data);

  // Очистка предыдущих данных
  const employeeList = document.getElementById('employeeList');
  employeeList.innerHTML = '';

  // Добавление каждого сотрудника в список
  data.Employees.forEach(employee => {
    const li = document.createElement('li');
    li.textContent = `${employee.FirstName} ${employee.LastName} - ${employee.Phone ? employee.Phone : ''} ${employee.EMail}, ${employee.Offices.map(e => e.Name).join(' ')}`;
    employeeList.appendChild(li);
  });
}

function fetchJSONP(url, callbackName) {
  const script = document.createElement('script');
  script.src = `${url}&callback=${callbackName}`;
  document.body.appendChild(script);
}

const apiUrl = 'https://it-academy.t8s.ru/Api/V2/GetEmployees';
const authkey = 'WuLyujCFtTDaxq4MorahbYMnYBsWJa823uwSla62X4olBglySpRyXjTLmLvEMBfW';
const callbackName = 'handleResponse';

fetchJSONP(`${apiUrl}?authkey=${encodeURIComponent(authkey)}`, callbackName);
