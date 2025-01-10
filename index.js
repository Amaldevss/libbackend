const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UserModel = require('./models/User')
const BookModel = require('./models/Books');
const RequestModel = require('./models/Request');

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/Library");


app.post('/signup', async (req, res) => {
    // UserModel.create(req.body)
    // .then(users => res.json(users))
    // .catch(err => res.json(err))
    try {
        const { email } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await UserModel.create(req.body);
        return res.status(201).json({ message: 'User created successfully', user: newUser });
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
})

app.post('/add-books', async (req, res) => {
    try {
        const { id } = req.body;

        const existingUser = await BookModel.findOne({ id });
        if (existingUser) {
            return res.status(400).json({ message: 'Book already exists' });
        }

        const newbook = await BookModel.create(req.body);
        return res.status(201).json({ message: 'Book created successfully', book: newbook });
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
})


app.post('/login', async (req, res) => {
    const { email, password } = req.body

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
        if (existingUser.password === password) {
            return res.status(200).json({
                message: 'Login successful',
                userDetails: {
                    name: existingUser.name,
                    place: existingUser.place,
                    age: existingUser.age,
                    email: existingUser.email,
                    education: existingUser.education,
                    contact: existingUser.contact,
                    phone: existingUser.phone
                }
            });
        }

        // const [name, setName] = useState()
        //   const [place, setPlace] = useState()
        //   const [age, setAge] = useState()
        //   const [email, setEmail] = useState()
        //   const [password, setPassword] = useState()
        //   const [education, setEducation] = useState()
        //   const [contact, setContact] = useState()
        //   const [phone, setPhone] = useState()
        else {
            return res.status(400).json({ message: 'Incorrect email or password' });
        }
    }
    else {
        return res.status(400).json({ message: 'Incorrect email or password' });
    }
})

app.post('/profile', async (req, res) => {
    const { email, age, education, contactDetails } = req.body
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
        existingUser.age = age || existingUser.age;
        existingUser.education = education || existingUser.education;
        existingUser.contactDetails = contactDetails || existingUser.contactDetails;
        await existingUser.save();
        return res.status(200).json({
            message: 'User updated successfully',
            user: existingUser,
        });

    } else {
        return res.status(404).json({ message: 'User not found' });
    }
})

app.get('/books', async (req, res) => {
    try {
        const books = await BookModel.find();  // Get all books
        return res.status(200).json(books);    // Return books as JSON
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching books', error: err.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find(); 
        return res.status(200).json(users);    
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching books', error: err.message });
    }
});



app.get('/Admindashboard', async (req, res) => {
    try {
        const requests = await RequestModel.find();  // Get all books
        return res.status(200).json(requests);    // Return books as JSON
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching requests', error: err.message });
    }
});





app.post('/singlepage', async (req, res) => {

    try {
        const { name, title , email, status, ExpiryTime, Expire } = req.body;

        // const existingUser = await UserModel.findOne({ email });
        // if(existingUser)
        // {
        //     return res.status(400).json({ message: 'User already exists' });
        // }

        const newRequest = await RequestModel.create(req.body);
        return res.status(201).json({ message: 'Request added successfully', request: newRequest });
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
})





app.put('/books', async (req, res) => {
    const { title , name} = req.body

    const existingBook = await BookModel.findOne({ title })
    const existingUser = await UserModel.findOne({ name })
    if (existingBook) {
        existingBook.rentalStatus = false;
        existingUser.NoOfBooks += 1;
        await existingBook.save();
        await existingUser.save();

        return res.status(200).json({ message: 'Rental status updated successfully', book: existingBook });
    }
    else {
        return res.status(400).json({ message: 'Incorrect email or password' });
    }
})


// app.delete('/Admindashboard', async (req, res) => {
//     const { title } = req.body
//     try {
//         const existingBook = await RequestModel.deleteOne({ title })
//         if (existingBook.deletedCount > 0) {
//             return res.status(200).json({ message: 'Req deleted successfully' });
//         } else {
//             return res.status(404).json({ message: 'Req not found' });
//         }
//     } catch (err) {
//         return res.status(500).json({ message: 'Error deleting Req', error: err.message });
//     }
// });

app.get('/profile', async (req, res) => {
    const { emailID } = req.query;
    console.log({emailID})
    try {
        const user = await UserModel.findOne({ email: emailID } );  // Get all books
        return res.status(200).json(user.NoOfBooks);    // Return books as JSON
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching Number of Books', error: err.message });
    }
});


app.get('/bookrequest', async (req, res) => {
    const { emailID } = req.query; // Make sure the query parameter name matches
    try {
      const requests = await RequestModel.find({ email: emailID }); // Fetch requests based on email
      return res.status(200).json(requests); // Return the filtered requests
    } catch (err) {
      return res.status(500).json({ message: 'Error fetching requests', error: err.message });
    }
  });
  


app.put('/bookrequest', async (req, res) => {
    const { _id } = req.body

    const existingBook = await RequestModel.findOne({ _id })

    if (existingBook && existingBook.status === 'Pending') {
        existingBook.status = "Accepted";

        await existingBook.save();


        return res.status(200).json({ message: 'Books accepted succesfully', book: existingBook });
    }
    else {
        return res.status(400).json({ message: 'Incorrect email or password' });
    }
})

app.put('/time', async (req, res) => {
    try {
        const { _id,ExpiryTime } = req.body;
        console.log(_id,ExpiryTime)
        const existingUser = await RequestModel.findOne({ _id });
        
        if (existingUser) {
            
            existingUser.ExpiryTime = ExpiryTime
            await existingUser.save();
            return res.status(201).json({ message: 'Time added successfully' });
        }
        else
           { return res.status(404).json({ message: 'User not found' });
    }
       
        
        
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
})

app.put('/decline', async (req, res) => {
    const { title, _id } = req.body

    const existingBook = await RequestModel.findOne({ _id })
    console.log({_id})

    if (existingBook && existingBook.status === 'Pending') {
        existingBook.status = "Declined";

        await existingBook.save();


        return res.status(200).json({ message: 'Books declined succesfully', book: existingBook });
    }
    else {
        return res.status(400).json({ message: 'Incorrect email or password' });
    }
})


app.get('/AdminRent', async (req, res) => {
    try {
        const accepted = await RequestModel.find();  // Get all books
        return res.status(200).json(accepted);    // Return books as JSON
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching books', error: err.message });
    }
});


app.get('/singlebookpage', async (req, res) => {
    const { title } = req.query;
    console.log({title})
    try {
        const user = await BookModel.findOne({ title: title } );  // Get all books
        return res.status(200).json(user.rentalStatus);    // Return books as JSON
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching Number of Books', error: err.message });
    }
});


// app.get('/bookreq', async (req, res) => {

//     try {
//         const requests = await RequestModel.find();  
//         return res.status(200).json(requests); 
//     } catch (err) {
//         return res.status(500).json({ message: 'Error fetching requests', error: err.message });
//     }
// });

app.delete('/bookrequest', async (req, res) => {
    const { _id } = req.body
    try {
        const existingBook = await RequestModel.deleteOne({ _id })
        if (existingBook.deletedCount > 0) {
            return res.status(200).json({ message: 'Req deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Req not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Error deleting Req', error: err.message });
    }
});


app.post('/membership-form', async (req, res) => {
    try {
        const { email, plan, currentDate, expiringDate, } = req.body;
        console.log( { email, plan, currentDate, expiringDate })
        // console.log({email,})

        // Create a new membership card
        //const newMembershipCard = await MembershipCard.create(req.body);
        
        // Find the user by email and update their membership details
        const existingUser = await UserModel.findOne({ email });
        
        if (existingUser) {
            
            // Update the user's membership details
            existingUser.membershipPlan = plan;
     
            existingUser.membershipStartDate = new Date(currentDate);

            existingUser.membershipExpiryDate = new Date(expiringDate);
         
            // Save the updated user
            await existingUser.save();
            
        }

        return res.status(201).json({ 
            message: 'Membership card created and user membership updated successfully', 
            //card: newMembershipCard 
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

app.get('/expire', async (req, res) => {

    try {
        const ex = await RequestModel.find();  // Get all books
        return res.status(200).json(ex);    // Return books as JSON
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching books', error: err.message });
    }
});


app.put('/like', async (req, res) => {
    const { title } = req.body

    const existingBook = await BookModel.findOne({ title })


    if (existingBook) {
        existingBook.likes += 1;

        await existingBook.save();


        return res.status(200).json({ message: 'Like Added succesfully', book: existingBook });
    }
    else {
        return res.status(400).json({ message: 'Like didnt added' });
    }
})


app.get('/like', async (req, res) => {
    const { title } = req.query
    
    try {
        // console.log("worked",{title})
        const Booklikes = await BookModel.findOne({ title });  
        
        return res.status(200).json(Booklikes.likes);    
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching likes', error: err.message });
    }
});

app.get('/comment', async (req, res) => {
    const { title } = req.query
    
    try {
        // console.log("worked",{title})
        const Bookcomments = await BookModel.findOne({ title });  
        return res.status(200).json(Bookcomments.comments);    
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching comments', error: err.message });
    }
});


app.put('/comment', async (req, res) => {
    const { title ,inputComment} = req.body


    const existingBook = await BookModel.findOne({ title })


    if (existingBook) {
        existingBook.comments = `${inputComment},${existingBook.comments}`;
        await existingBook.save();


        return res.status(200).json({ message: 'Like Added succesfully', book: existingBook });
    }
    else {
        return res.status(400).json({ message: 'Like didnt added' });
    }
})

app.listen(3001, () => {
    console.log("Server is running")
})