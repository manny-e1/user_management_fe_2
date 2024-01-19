import cookies from 'js-cookie';
import secureLocalStorage from 'react-secure-storage';
import Swal from 'sweetalert2';

export function capitalizeEveryWord(str?: string) {
  return str?.replace(/\b\w/g, (match) => match.toUpperCase());
}

export function formatCurrency(num: number) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function validateNumberInput(input: string) {
  const regex = /^[0-9,.]*$/;

  if (!regex.test(input)) {
    input = input.replace(/[^0-9,.]/g, '');
  }
  return input;
}

export function removeComma(input: string) {
  const str = input.replace(/,/g, '');
  if (!str) {
    return '0.0';
  }
  return str;
}

export function formatDate(date?: Date) {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = date.getHours() < 12 ? 'AM' : 'PM';

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
  return formattedDate;
}

export function getHeader(type: 'AUTHPOST' | 'AUTHGET' | 'NORMALPOST') {
  const token = sessionStorage.getItem('token') || cookies.get('token');
  const headers: { Authorization?: string; 'Content-Type'?: string } = {};
  if (type === 'AUTHPOST') {
    headers['Content-Type'] = 'application/json';
    headers.Authorization = `Bearer ${token}`;
  } else if (type === 'AUTHGET') {
    headers.Authorization = `Bearer ${token}`;
  } else {
    headers['Content-Type'] = 'application/json';
  }
  return {
    headers,
  };
}
