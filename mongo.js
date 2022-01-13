const mongoose = require('mongoose')

const argumentsLength = process.argv.length



const personSchema = new mongoose.Schema({
    name : String,
    number : String
})

const Person = new mongoose.model('Person',personSchema)

const displayData = () => {
    const password = process.argv[2]
    const url = `mongodb+srv://user:${password}@fsocluster.tt3kq.mongodb.net/phonebook-app?retryWrites=true&w=majority`
    mongoose.connect(url)
    Person.find({}).then(result =>{
        console.log("phonebook:")
        result.forEach(person => {
            console.log(person.name, person.number)
        });
        mongoose.connection.close()
    })
}

addPerson = () => {
    const password = process.argv[2]
    const url = `mongodb+srv://user:${password}@fsocluster.tt3kq.mongodb.net/phonebook-app?retryWrites=true&w=majority`
    mongoose.connect(url)

    const person = new Person({
        name : process.argv[3],
        number:process.argv[4]
    })
    
    person.save().then(
        console.log(`added ${person.name} ${person.number} to Phonebook`)
    ).then( person =>
        mongoose.connection.close())

}




if(argumentsLength === 3){
    console.log("all data should be displayed")
    displayData()
}else if (argumentsLength == 5){
    console.log("more than 2 parameters have been given, user with number should be added")
    addPerson()
}else{
    (console.log("please provide correct amount of input parameters"))}

