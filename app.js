// REQUIRED ELEMENTS
let expressSanitizer = require("express-sanitizer"),
methodOverride       = require("method-override"),
bodyParser           = require("body-parser"),
mongoose             = require("mongoose"),
express              = require("express"),
app                  = express();


// MONGOOSE DEPRECATION WARNINGS FIX
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

// APP CONFIG
mongoose.connect("mongodb://localhost/resful_blog_app"); 
app.set("view engine", "ejs"); 
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(expressSanitizer()); 
app.use(methodOverride("_method")); 


// MONGOOSE MODEL CONFIG
let blogSchema = new mongoose.Schema({
	title: String, 
	image: String, 
	body: String,
	created: {type: Date, default: Date.now}
}); 

let Blog = mongoose.model("Blog", blogSchema); 


// RESTFUL ROUTES: 
app.get("/", (req, res) => {
	res.redirect("/blogs"); 
}); 

// INDEX ROUTE
app.get("/blogs", (req, res) => {
	Blog.find({}, (err, blogs) => {
		if(err){
			console.log("ERROR!"); 
		} else {
			res.render("index", {blogs: blogs}); 
		}
	})
}); 

// NEW ROUTE
app.get("/blogs/new", (req, res) => {
	res.render("new"); 
}); 

// CREATE ROUTE
app.post("/blogs", (req, res) => {
	// CREATE BLOG
	req.body.blog.body = req.sanitize(req.body.blog.body); 
	Blog.create(req.body.blog, (err, newBlog) => {
		if(err){
			res.render("new"); 
		} else {
			// 	THEN, REDIRECT TO THE INDEX
			res.redirect("/blogs"); 
		}
	}); 
}); 

// SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err){
			res.redirect("/blogs"); 
		} else {
			res.render("show", {blog: foundBlog}); 
		}
	}); 
}); 

// EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err){
			res.redirect("/blogs")
		} else {
			res.render("edit", {blog: foundBlog}); 
		}
	})
})

// UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body); 
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if(err) {
			res.redirect("/blogs"); 
		} else {
			res.redirect("/blogs/" + req.params.id); 
		}
	}); 
}); 

// DESTROY ROUTE
app.delete("/blogs/:id", (req, res) => {
	// DESTORY BLOG
	Blog.findByIdAndRemove(req.params.id, (err) => {
		if(err){
			res.redirect("/blogs"); 
		} else {
			res.redirect("/blogs"); 
		}
	})
})


app.listen(3000, () => {
    console.log("SERVER IS RUNNING ON PORT 3000!"); 
}); 