const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

chai.use(chaiHttp);
const user = {
  firstname: 'test7',
  lastname: '007',
  email: '007@mail.com',
  password: '1234AAbb#',
};
const errorUserEmail = {
  firstname: 'test7',
  lastname: '007',
  email: 'wrongemail',
  password: 'wrongpassword',
};
const errorUserPassword = {
  firstname: 'test7',
  lastname: '007',
  email: 'wrongemail@gmail.com',
  password: 'wrongpassword',
};

let token;
let resetPassWordToken;
let verificationToken;

function usersTest() {
  describe('POST /users/signup', () => {
    it('shouild create a new user', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.user.firstname).to.equal(user.firstname);
          expect(res.body.user.lastname).to.equal(user.lastname);
          expect(res.body.user.email).to.equal(user.email);
          expect(res.body).to.have.property('token');
          token = res.body.token;
          done();
        });
    });

    it('should return a status code of 409 if the user alredy exist', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.message).to.equal(
            'This email address has already been registered to an account.'
          );
          done();
        });
    });
    it('should throw an error if the email format is not correct', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send(errorUserEmail)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal(
            'the email you entered appers to be missing the @ symbol'
          );
          done();
        });
    });
    it('should throw an error if the password format is not correct', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send(errorUserPassword)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal(
            'make sure your password has at least one upper-case, lowercase, symbol, number, and is has a minimun of 8 characters in length example (AAbb12#$)'
          );
          done();
        });
    });
  });
  describe('POST /users/signin', () => {
    it('should login a user when all required data is provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/signin')
        .send({ email: user.email, password: user.password })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.user.firstname).to.equal(user.firstname);
          expect(res.body.user.lastname).to.equal(user.lastname);
          expect(res.body.user.email).to.equal(user.email);
          expect(res.body).to.have.property('token');
          done();
        });
    });
    it('should throw an error if the resquest body is missing one or more fields', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/signin')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal(
            'please enter your email and password'
          );
          done();
        });
    });
    it('should throw an error if the user is not registered', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/signin')
        .send(errorUserEmail)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('invalid email or password');
          done();
        });
    });
    it('throw an error if the user password is not correct', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/signin')
        .send({ email: user.email, password: 'wrongpassword' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal('invalid email or password');
          done();
        });
    });
  });

  describe('POST /get_user_info', () => {
    it('gets user information using token', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/get_user_info')
        .send({ token })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.userInfo.username).to.equal(user.firstname);
          expect(res.body.userInfo.useremail).to.equal(user.email);
          done();
        });
    });
    it('should throw an error if no token is provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/get_user_info')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal('please provide a token');
          done();
        });
    });
  });

  describe('POST /signin', () => {
    it('should login a user when all required data is provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/signin')
        .send({ email: user.email, password: user.password })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.user.firstname).to.equal(user.firstname);
          expect(res.body.user.lastname).to.equal(user.lastname);
          expect(res.body.user.email).to.equal(user.email);
          expect(res.body).to.have.property('token');
          done();
        });
    });
    it('should throw an error if the resquest body is missing one or more fields', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/signin')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal(
            'please enter your email and password'
          );
          done();
        });
    });
    it('should throw an error if the user is not registered', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/signin')
        .send(errorUserEmail)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('invalid email or password');
          done();
        });
    });
  });

  describe('POST /forgot_passsword', () => {
    it('should throw an error if the email is not register to an account', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/forgot_passsword')
        .send({ email: 'wrong@gmail.com' })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('no user found with that email');
          done();
        });
    });
    it('send a verification mail to the user', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/forgot_passsword')
        .send({ email: user.email })
        .end((err, res) => {
          resetPassWordToken = res.body.token;
          expect(res).to.have.status(202);
          expect(res.body.message).to.equal(
            'A verification code has been sent to your email'
          );
          done();
        });
    });
  });
  describe('POST /verification_code', () => {
    it('should throw an error if the resquest body is missing one or more fields', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/verification_code')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal(
            'Ensure all neccessary fields are provided with their correct credentials'
          );
          done();
        });
    });
    it('should throw an error if the verification code is not correct', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/verification_code')
        .send({ token: resetPassWordToken, verificationCode: 12344 })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal('invalid verification code');
          done();
        });
    });
    it('should generate a new token if the verification code is correct', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/verification_code')
        .send({ token: resetPassWordToken, verificationCode: 12345 })
        .end((err, res) => {
          verificationToken = res.body.token;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });
  describe('PATCH /reset_password', () => {
    it('should throw an error if the resquest body is missing one or more fields', (done) => {
      chai
        .request(app)
        .patch('/api/v1/users/reset_password')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal(
            'Ensure all neccessary fields are provided with their correct credentials'
          );
          done();
        });
    });
    it('should throw an error if the password format is incorrect', (done) => {
      chai
        .request(app)
        .patch('/api/v1/users/reset_password')
        .send({ token: verificationToken, password: 'password' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal(
            'make sure your password has at least one upper-case, lowercase, symbol, number, and is has a minimun of 8 characters in length example (AAbb12#$)'
          );
          done();
        });
    });
    it('should reset the user password if the token is valid and the new password format is correct', (done) => {
      chai
        .request(app)
        .patch('/api/v1/users/reset_password')
        .send({ token: verificationToken, password: '1234AAbb#' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal(
            'you have successfully reset your password'
          );
          done();
        });
    });
  });
  describe('POST /delete_account', () => {
    it('should throw an error if either or both of the required fields is missing', (done) => {
      chai
        .request(app)
        .delete('/api/v1/users/delete_account')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal(
            'please provide all required feilds (email and passsword)'
          );
          done();
        });
    });
    it('should throw an error if the email is no register to an account', (done) => {
      chai
        .request(app)
        .delete('/api/v1/users/delete_account')
        .send(errorUserEmail)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('no user with that email');
          done();
        });
    });
    it('should throw an error if the password is not correct', (done) => {
      chai
        .request(app)
        .delete('/api/v1/users/delete_account')
        .send({ email: user.email, password: 'wrongpassword' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal(
            'you are not authorized to delete this account'
          );
          done();
        });
    });
    it('delete a user account', (done) => {
      chai
        .request(app)
        .delete('/api/v1/users/delete_account')
        .send({ email: user.email, password: user.password })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal(
            'you have successfully closed your account.'
          );
          done();
        });
    });
  });
}

module.exports = usersTest;