
# Very iportant thing to do on debugging

* Spellcheck the names of variables 
* Check the scope of variable

<br>

# Nodejs

## passportjs module (error: missing credentials)

Passport uses as credentials the **username** and **password**.
When an app uses as credentials the **email** instead **username** then must be inticate in `passport.js` file like bellow on `usernameField: 'email'`. 

```
module.exports = function(passport) {
  passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password1'}, (email, password, done) => {
    ...
  }));
} 
```

 An other thing it is worth notting is the **password** credential. If on **login** or **signup** forms the attribute name that is passed for password is different from `password` it must be inticated as well like above on `passwordField: 'password1'`. In this case the attribute name on the form is `password1`.

<br>

# Bootstrap

## Headings in **rems**

**h1: 2.5rem**

**h2: 2 rem**

**h3: 1.75rem**

**h4: 1.5rem**

**h5: 1.25rem**

**h6: 1rem**

<br>

# CSS

## style.css

Maiby is better to use `bg-white` bootstrap class in the HTML instead of making the card header **white** like bellow

```
.card-manage-account .card-header,
.card-manage-profile .card-header,
.card-manage-modules .card-header {
  background-color: #fff;
}
```