import './content.css';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

const Content = ({ user_data }) => {
    const edit_profile_popup = useRef();
    const add_book_popup = useRef();
    const edit_full_name_input = useRef();
    const edit_email_input = useRef();
    const edit_password_input = useRef();
    const [books_data, setBooks_data] = useState([]);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({...user_data})
    const fileinput = useRef();
    const pfp_upload = useRef();
    const [file, setFile] = useState(data.cover_photo);
    const books_cover_input = useRef();
    const books_pdf_input = useRef();
    const [cover_photo_div, setBookCover] = useState("")
    const book_title = useRef();
    const book_description = useRef();
    const book_category = useRef();
    const book_genre = useRef();
    const [booklikcomm, setBooklikcom] = useState([])
    const book_author = useRef();
    var dt;
    const [selectedBook, setSelectedBook] = useState(null);

    const openEditBookPopup = (book) => {
        if(!book){
            setSelectedBook(null);
            setBookCover("");
            book_title.current.value = "";
            book_author.current.value = "";
            book_description.current.value = "";
            book_category.current.value = "";
            book_genre.current.value = "";
            add_book_popup.current.style.display = 'flex';
            return
        }
        setSelectedBook(book);
        setBookCover(book.cover_url || "");
        book_title.current.value = book.title;
        book_author.current.value = book.author;
        book_description.current.value = book.description;
        book_category.current.value = book.category;
        book_genre.current.value = book.genre;
        add_book_popup.current.style.display = 'flex';
    };
    useEffect(() => {
        if (!add_book_popup.current.style.display || add_book_popup.current.style.display === 'none') {
            setSelectedBook(null);
            setBookCover("");
            book_title.current.value = "";
            book_author.current.value = "";
            book_description.current.value = "";
            book_category.current.value = "";
            book_genre.current.value = "";
        }
    }, [add_book_popup.current]);
    
    const change_book_cover = () => {
        const file = books_cover_input.current.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setBookCover(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const checkDetails = () => {
        const name = edit_full_name_input.current.value.trim();
        const email = edit_email_input.current.value.trim();
        const password = edit_password_input.current.value.trim();

        const newErrors = {};

        if (!/^[a-zA-Z\s]{3,}$/.test(name)) {
        newErrors.name = "must contain only alphabets and more than 3 characters long.";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Please enter a valid email address.";
        }

        if(password.length != 0){
            if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)
            ){
                newErrors.password = "Password Not Strong enough.";
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            showToast("Registering, Please wait!");
            save();
        }
    };

    const showToast = (message)=> {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast show';
        setTimeout(() => {
        toast.className = toast.className.replace('show', '');
        }, 3000);
    };

    const setCookie = (name, value, days, path = "/", domain, secure)=> {
        let expires = "";
        
        if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
        }
    
        let cookie = `${name}=${value || ""}${expires}; path=${path}`;
        
        if (domain) {
        cookie += `; domain=${domain}`;
        }
        
        if (secure) {
        cookie += "; secure";
        }
        
        document.cookie = cookie;
    }


    const fetch_data = async () => {
        const response = await fetch(`http://localhost:5000/books/byuserid/${data.id_user}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            const books = await response.json();
            const newBooklikcomm = await Promise.all(books.map(async (book) => {
                try {
                    const response = await fetch(`http://localhost:5000/rates/byid/${book.id_book}`);
                    const comt = await fetch(`http://localhost:5000/reviews/count/${book.id_book}`)
                    if (response.ok && comt.ok) {
                        const comtdata = await comt.json();
                        console.log(comtdata);
                        const responseData = await response.json();
                        return {
                            likes: responseData[0].value === null ? 0 : responseData[0].value,
                            comments: comtdata
                        };
                    }
                } catch (error) {
                    console.log(error);
                }
                return {
                    likes: 0,
                    comments: 0
                };
            }));
            setBooks_data(books);
            setBooklikcom(newBooklikcomm);
        }
    };
    

    useEffect(() => {
        edit_email_input.current.value = data.email;
        edit_full_name_input.current.value = data.full_name;
        fetch_data();
    }, [data]);

    const close_popup = () => {
        edit_profile_popup.current.style.display = 'none';
    };
    const open_popup = () => {
        edit_profile_popup.current.style.display = 'flex';
    };

    const delete_account  = async ()=>{
        showToast("Deleting Account, Please wait!")
        const response = await fetch(`http://localhost:5000/users/${data.id_user}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(response.ok){
            const d = await response.json()
            if(d.length > 0){
                showToast("Account Deleted Successfully!");
                setCookie("email", "", 7, "/", undefined, true);
                setCookie("password", "", 7, "/", undefined, true);
                setTimeout(() => {
                    window.location.href = "./profile"
                }, 3000);
            }else{
                showToast("Failed to delete account!")
            }
        }
        else{
            showToast("Failed to delete account!")
        }
    }

    const logout = async()=>{
        setCookie("email", "", 7, "/", undefined, true);
        setCookie("password", "", 7, "/", undefined, true);
        showToast("Logging out, Please wait!")
        setTimeout(() => {
            window.location.href = "./profile"
        }, 2000);
    }

    const pfp_change = ()=>{
        const file = fileinput.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('load', function(){
            pfp_upload.current.src = reader.result;
        });
    }

    const doneupload = async()=>{
        const file = fileinput.current.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`http://localhost:5000/users/uploadpfp/${data.id_user}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.length > 0) {
                    showToast("Profile Picture Updated Successfully!");
                    setData(responseData[0]);
                    setFile(responseData[0].cover_photo);
                    close_popup();
                } else {
                    showToast("Failed to update profile picture!");
                }
            } else {
                showToast("Failed to update profile picture!");
            }
        } catch (error) {
            showToast("Failed to update profile picture!");
        }
    }

    const save = async () => {
        if(fileinput.current.files.length > 0){
            await doneupload();
        }
        const full_name = edit_full_name_input.current.value.trim();
        const email = edit_email_input.current.value.trim();
        var body;
        if(edit_password_input.current.value.trim().length != 0){
            body = {
                full_name,
                email,
                password: edit_password_input.current.value.trim()
            }
        }
        body = {
            full_name,
            email
        };

        const response = await fetch(`http://localhost:5000/users/${data.id_user}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            const d = await response.json();
            if (d.length > 0) {
                showToast("Account updated successfully!");
                setData(d[0]);
                close_popup();
            } else {
                showToast("Failed to update account!");
            }
        } else {
            showToast("Email Already in use!");
        }
    };

    const check_book_details = ()=>{
        if(book_title.current.value.trim().length == 0){
            showToast("Please Enter Book Title!");
            return false;
        }
        if(book_author.current.value.trim().length == 0){
            showToast("Please Enter Book Author!");
            return false;
        }
        if(book_description.current.value.trim().length == 0){
            showToast("Please Enter Book Description!");
            return false;
        }
        if(books_cover_input.current.files.length == 0){
            showToast("Please Upload Book Cover!");
            return false;
        }
        if(books_pdf_input.current.files.length == 0){
            showToast("Please Upload Book PDF!");
            return false;
        }
        if(book_category.current.value.trim().length == 0){
            showToast("Please Enter Book Category!");
            return false;
        }
        if(book_genre.current.value.trim().length == 0){
            showToast("Please Enter Book Genre!");
            return false;
        }
        return true
    }

    const check_edit_book_details = ()=>{
        if(book_title.current.value.trim().length == 0){
            showToast("Please Enter Book Title!");
            return false;
        }
        if(book_author.current.value.trim().length == 0){
            showToast("Please Enter Book Author!");
            return false;
        }
        if(book_description.current.value.trim().length == 0){
            showToast("Please Enter Book Description!");
            return false;
        }
        if(book_category.current.value.trim().length == 0){
            showToast("Please Enter Book Category!");
            return false;
        }
        if(book_genre.current.value.trim().length == 0){
            showToast("Please Enter Book Genre!");
            return false;
        }
        return true
    }

    // const saveBook = async () => {
    //     const title = book_title.current.value.trim();
    //     const description = book_description.current.value.trim();
    //     const category = book_category.current.value.trim();
    //     const genre = book_genre.current.value.trim();
    //     const id_user = data.id_user;
    //     const author = book_author.current.value.trim();
    //     const pdf_url = "test";
    //     const body = {
    //         title,
    //         description,
    //         category,
    //         genre,
    //         id_user,
    //         pdf_url,
    //         author
    //     }
    //     console.log(body);
    //     try {
    //         showToast("Uploading Book...");
    //         const response = await fetch(`http://localhost:5000/books/`, {
    //             method: 'POST',
    //             headers: {
    //                 "Content-Type": "application/json",
    //               },
    //             body: JSON.stringify(body),
    //         });

    //         if (response.ok) {
    //             var responseData = await response.json();
    //             if (responseData.length > 0) {
    //                 showToast("Uploading Book's Cover...");
    //                 try{
    //                     const formData = new FormData();
    //                     formData.append('file', books_cover_input.current.files[0]);
    //                     const uploadcover = await fetch(`http://localhost:5000/books/uploadcover/${responseData[0].id_book}`, {
    //                         method: 'POST',
    //                         body: formData,
    //                     });
    //                     if (uploadcover.ok){
    //                         responseData = await uploadcover.json();
    //                         if (responseData.length > 0) {
    //                             showToast("Uploading Book's PDF...");
    //                             const formDataPdf = new FormData();
    //                             formDataPdf.append('file', books_pdf_input.current.files[0]);
    //                             try{
    //                                 const uploadpdf = await fetch(`http://localhost:5000/books/uploadpdf/${responseData[0].id_book}`, {
    //                                     method: 'POST',
    //                                     body: formDataPdf,
    //                                 });
    //                                 if (uploadpdf.ok){
    //                                     showToast("Book Uploaded Successfully!");
    //                                     fetch_data();
    //                                     add_book_popup.current.style.display = "none";
    //                                     return;
    //                                 } else {
    //                                     showToast("Failed to upload book's pdf!");
    //                                 }
    //                             }catch{
    //                                 showToast("Error to upload book's pdf!");
    //                             }
    //                         }
    //                     } else{
    //                         showToast("Failed to upload book's Cover!");
    //                     }
    //                 }
    //                 catch{
    //                     showToast("Error to upload book's Cover!");
    //                 }
    //             }
    //         } else {
    //             showToast("Failed to upload book's data!");
    //         }
    //     } catch (error) {
    //         showToast("Error uploading book's data!");
    //     }
    // };
    const saveBook = async () => {
        if(!selectedBook){
            console.log("hello");
            if(!check_book_details()){
                return false
            }
        }
        else{
            if(!check_edit_book_details()){
                return false
            }
        }
        const title = book_title.current.value.trim();
        const description = book_description.current.value.trim();
        const category = book_category.current.value.trim();
        const genre = book_genre.current.value.trim();
        const id_user = data.id_user;
        const author = book_author.current.value.trim();
        const pdf_url = "test";
        const body = {
            title,
            description,
            category,
            genre,
            id_user,
            pdf_url,
            author
        };
    
        const method = selectedBook ? 'PATCH' : 'POST';
        const url = selectedBook ? `http://localhost:5000/books/${selectedBook.id_book}` : 'http://localhost:5000/books/';
    
        console.log(body);
        try {
            showToast(selectedBook ? "Updating Book..." : "Uploading Book...");
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
    
            if (response.ok) {
                var responseData = await response.json();
                if (responseData.length > 0) {
                    if (books_cover_input.current.files.length > 0) {
                        showToast("Uploading Book's Cover...");
                        try {
                            const formData = new FormData();
                            formData.append('file', books_cover_input.current.files[0]);
                            const uploadcover = await fetch(`http://localhost:5000/books/uploadcover/${responseData[0].id_book}`, {
                                method: 'POST',
                                body: formData,
                            });
                            if (uploadcover.ok) {
                                responseData = await uploadcover.json();
                                if (responseData.length > 0) {
                                    showToast("Uploading Book's PDF...");
                                    const formDataPdf = new FormData();
                                    formDataPdf.append('file', books_pdf_input.current.files[0]);
                                    try {
                                        const uploadpdf = await fetch(`http://localhost:5000/books/uploadpdf/${responseData[0].id_book}`, {
                                            method: 'POST',
                                            body: formDataPdf,
                                        });
                                        if (uploadpdf.ok) {
                                            showToast("Book Uploaded Successfully!");
                                            fetch_data();
                                            add_book_popup.current.style.display = "none";
                                            return;
                                        } else {
                                            showToast("Failed to upload book's pdf!");
                                        }
                                    } catch {
                                        showToast("Error to upload book's pdf!");
                                    }
                                }
                            } else {
                                showToast("Failed to upload book's Cover!");
                            }
                        } catch {
                            showToast("Error to upload book's Cover!");
                        }
                    } else {
                        showToast("Book Uploaded Successfully!");
                        fetch_data();
                        add_book_popup.current.style.display = "none";
                    }
                }
            } else {
                showToast("Failed to upload book's data!");
            }
        } catch (error) {
            showToast("Error uploading book's data!");
        }
    };
    
    return (
        <div className="profile-container">
            <div className='pf-details-section'>
                <div className='left'>
                    <div className='pf-pfp'>
                        <img src={file} alt="profile" />
                    </div>
                    <div className='pf-details'>
                        <h2>{data.full_name}</h2>
                        <p>{data.email}</p>
                        <p className='logout' onClick={()=>logout()}>Logout</p>
                    </div>
                </div>
                <div className='right'>
                    <button onClick={open_popup}>Edit Profile</button>
                </div>
            </div>
            <div className='hr'>
                <hr />
            </div>
            <div className='pf-menu'>
                <div className='posts selected'>Posts</div>
                <div className='playlists'>Playlists</div>
            </div>
            <div className='hr'>
                <hr />
            </div>

            <div className='posts-container'>
                <div className='upload-container'>
                    <div className='up'>
                        <div type="text" placeholder='Upload Book?' onClick={()=>openEditBookPopup()}>Upload Book?</div>
                    </div>
                    <div className='down'>
                        <button onClick={()=>{
                            books_cover_input.current.click();
                            add_book_popup.current.style.display = 'flex';
                        }}>
                            <span className="material-symbols-outlined">
                                upload_file
                            </span>
                            Upload Book
                        </button>
                        <button onClick={()=>{
                            books_pdf_input.current.click();
                            add_book_popup.current.style.display = 'flex';
                        }}>
                            <span className="material-symbols-outlined">
                                photo_library
                            </span>
                            Book's Cover
                        </button>
                    </div>
                </div>
                <div className='title'>
                    Posts
                    <hr />
                </div>
                <div className='posts-list'>
                {books_data.map((book, index) => (
                    <div key={book.id_book} className={index % 2 === 0 ? 'card' : 'reversecard card'}>
                        <div className='details'>
                            <div className='name'>{book.title}</div>
                            <div className='author'>{book.author} &nbsp;</div>
                            <div className='description'>{book.description}</div>
                            <div className='book-details-rev-likes'>
                                {booklikcomm[index] ? (
                                    <>
                                        <div className='like'>
                                            {booklikcomm[index].likes}
                                            <span className="material-symbols-outlined">favorite</span>
                                        </div>
                                        <div className='comment'>
                                            {booklikcomm[index].comments}
                                            <span className="material-symbols-outlined">comment</span>
                                        </div>
                                    </>
                                ) : (
                                    <div>Loading...</div>
                                )}
                            </div>
                            <div className='buttons'>
                                <div className='readmore'>Read More</div>
                                <div className='openbook' onClick={() => openEditBookPopup(book)}>Edit/Delete</div>
                            </div>
                        </div>
                        <div className='cover_photo'>
                            <div className='photo-container'>
                                <img src={book.cover_url || "/bookcover.jpg"} alt="book cover" width={300} height={450} />
                            </div>
                        </div>
                    </div>
                ))}
                    {books_data.length === 0 && (
                        <div className='end-post'>
                            No Posts Available
                        </div>
                    )}
                </div>
            </div>
            <div className='edit-profile-popup' ref={edit_profile_popup}>
                <div className='edit-profile-content'>
                    <div className='exit'>
                        <div onClick={close_popup}>X</div>
                    </div>
                    <div className='details-edit'>
                        <div className='pf-pfp'>
                            <img ref={pfp_upload} src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" alt="profile" />
                            <div className='edit-button'>
                                <button onClick={()=>{fileinput.current.click()}}>
                                    Upload
                                </button>
                                <input type='file' ref={fileinput} className='gone' onChange={()=>pfp_change()}/>
                            </div>
                        </div>
                        <div className='pf-inputs'>
                            <input type='text' placeholder='Full name' ref={edit_full_name_input} />
                            {errors.name && <div className="error">{errors.name}</div>}
                            <input type='text' placeholder='Email' ref={edit_email_input} />
                            {errors.email && <div className="error">{errors.email}</div>}
                            <input type='password' placeholder='New Password' ref={edit_password_input} />
                            {errors.password && <div className="error">{errors.password}</div>}

                        </div>
                        <div className='submit right'>
                            <div onClick={()=>delete_account()}>Delete Account</div>
                            <button onClick={()=>checkDetails()}>Save</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='add-book-popup edit-profile-popup' ref={add_book_popup}>
                <div className='add-book-content edit-profile-content'>
                    <div className='exit'>
                        <div onClick={()=>add_book_popup.current.style.display = "none"}>X</div>
                    </div>
                    <div className='details-add'>
                        <div className='cover-photo'>
                            <div className='photo-container'>
                                <img src={cover_photo_div} alt="" />
                            </div>
                            <input type='file' className='gone' accept='image/*' ref={books_cover_input} onChange={()=>{change_book_cover()}}/>
                            
                            <button onClick={()=>{books_cover_input.current.click()}}>Books's Cover</button>
                        </div>
                        <div className='pf-inputs'>
                            <div className='title'>Book Details:</div>
                            <input type='text' placeholder='Book Title' ref={book_title} />
                            {errors.title && <div className="error">{errors.title}</div>}
                            
                            <input type='text' placeholder='Book author' ref={book_author} />
                            {errors.author && <div className="error">{errors.author}</div>}
                            
                            <input type='text' placeholder='Description' ref={book_description} />
                            {errors.description && <div className="error">{errors.description}</div>}

                            <input type='text' placeholder='Category' ref={book_category} />
                            {errors.category && <div className="error">{errors.category}</div>}
                            
                            <input type='text' placeholder='Genre' ref={book_genre} />
                            {errors.genre && <div className="error">{errors.genre}</div>}
                            <div className='upload-book-button'>
                                <input type='file' className='gone' accept='.pdf' ref={books_pdf_input}/>
                                <button onClick={()=>{books_pdf_input.current.click()}}>Upload Pdf</button>
                            </div>
                        </div>
                        
                    </div>
                    <div className='submit right'>
                        <button onClick={()=>saveBook()}>Save Book</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Content;
