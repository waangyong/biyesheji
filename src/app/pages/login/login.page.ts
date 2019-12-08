import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userChecked = false;  // 判断用户名边框样式
  pwdChecked = false;   // 判断密码边框样式
  loginInfo = {
    userName: '', // 用户名
    passWord: '',  // 密码
    remName: false,
    remPwd: false // 是否保存
  };
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
    if (localStorage.getItem('loginInfo')) {
      this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
      if (this.loginInfo.userName) {
        this.loginInfo.remName = true;
      } else {
        this.loginInfo.remName = false;
      }
      if (this.loginInfo.passWord) {
        this.loginInfo.remPwd = true;
      } else {
        this.loginInfo.remPwd = false;
      }
    }
  }

  /**
   * 判断当前选中的框，显示样式
   * @param flag 1用户名；2密码
   */
  inputCLick(flag) {
    if (flag === 1) {
      this.userChecked = true;
      this.pwdChecked = false;
    } else {
      this.userChecked = false;
      this.pwdChecked = true;
    }
  }

  login() {
    this.router.navigate(['app']);

    if (this.loginInfo.remPwd) {
      localStorage.setItem('loginInfo', JSON.stringify({
        userName: this.loginInfo.userName,
        passWord: this.loginInfo.passWord
      }));
    } else if (this.loginInfo.remName) {
      localStorage.setItem('loginInfo', JSON.stringify({
        userName: this.loginInfo.userName
      }));
    } else {
      localStorage.setItem('loginInfo', JSON.stringify({
        userName: '',
        passWord: ''
      }));
    }
  }

 /**
  * 记住用户名和密码
  * @param index  1 记住用户名    2 记住密码
  */
  remember(index) {
    if (index === 1) {
      this.loginInfo.remName = !this.loginInfo.remName;
    } else if (index === 2) {
      this.loginInfo.remPwd = !this.loginInfo.remPwd;
    }
  }
}
