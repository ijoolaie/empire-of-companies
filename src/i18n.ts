export type Lang='en'|'fa';
const dict={
 en:{brand:'Empire of Companies',cash:'Cash',energy:'Energy',income:'Income / 30s',level:'Level',build:'Build desk',hire:'Hire worker',collect:'Collect',save:'Save',language:'فارسی',hint:'Tap Build desk, then tap the floor to place it.',office:'Office 101',worker:'Employees',welcome:'Your first office is open. Build, hire and grow!',notEnough:'Not enough cash.'},
 fa:{brand:'امپراتور شرکت‌ها',cash:'پول',energy:'انرژی',income:'درآمد / ۳۰ ثانیه',level:'سطح',build:'ساخت میز',hire:'استخدام کارمند',collect:'دریافت درآمد',save:'ذخیره',language:'English',hint:'ساخت میز را بزنید، سپس روی کف اتاق لمس کنید.',office:'دفتر ۱۰۱',worker:'کارمند',welcome:'اولین دفتر شما آماده است؛ بسازید، استخدام کنید و توسعه دهید!',notEnough:'پول کافی نیست.'}
};
export function t(lang:Lang,key:keyof typeof dict.en){return dict[lang][key]}