
if(process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongodb+srv://dbuser_a:admin100@curriculum-prod-rdfqz.mongodb.net/test?retryWrites=true&w=majority'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/curriculum-dev'}
}
