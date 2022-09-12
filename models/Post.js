
const postsCollections = require('../db').db().collection('posts')
const ObjectID = require('mongodb').ObjectID
let Post = function(data, userid) {
    this.data = data
    this.errors = []
    this.userid = userid
}

Post.prototype.cleanUp = function() {
    if (typeof(this.data.title) != "string") {this.data.title = ""}
    if (typeof(this.data.body) != "string") {this.data.body = ""}

    // get rid of any bogus properties
    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        createdDate: new Date(),
        author: ObjectID(this.userid)
    }
}

Post.prototype.validate = function () {
    if (this.data.title == "") {this.errors.push('You must provide a title')}
    if (this.data.body == "") {this.errors.push('You must provide post content')}
}

Post.prototype.create = function () {
    return new Promise ((resolve, reject) => {
        this.cleanUp()
        this.validate()
        if (!this.errors.length) {
            postsCollections.insertOne(this.data).then(()=> {
                resolve()
            }).catch(() => {
                this.errors.push('Please try again later.')
                reject(this.errors)
            })
        } else {
            reject(this.errors)
        }
    })
}

// this line of code is interesting bcz here we are adding a function to Post function (this is the advantage of javascript, fn are also treated as objects)
Post.findSingleById = function (id) {
    return new Promise(async function (resolve, reject) {
        if (typeof(id) != 'string' || !ObjectID.isValid(id)) {
            reject()
            return
        }
        let post = await postsCollections.findOne({_id: new ObjectID(id)})
        if (post)  {
            resolve(post)
        } else {
            reject()
        }  
    })
}


module.exports = Post