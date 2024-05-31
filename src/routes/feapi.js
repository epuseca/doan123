const express = require('express')
const routerAPI = express.Router()

const { getUsersAPI, postImageUser, postCreateUserAPI, putUpdateUserAPI, deleteUserAPI, getUserAPIById, loginUser, registerUser }
    = require('../controller/userController')

const { postCreateCTDT, deleteCTDT, updateCTDT }
    = require('../controller/ctdtController')

const { postCreateCourse, getAllCourse, deleteCourse, updateCourse }
    = require('../controller/courseController')

const { postCreateClass, getAllClass, deleteClass, updateClass }
    = require('../controller/classController')

const { postCreateClassExam, getAllClassExam, deleteClassExam, updateClassExam }
    = require('../controller/classExamController')

const { postCreateKqht, getAllKqht, deleteKqht, updateKqht }
    = require('../controller/kqhtController')

const middleware = require('../middleware/middleware')

const { getHomePage, getData } = require('../controller/homeController')

const { getMain, searchTeacher, searchStudentByName,
    deleteACTDT, postNewCTDT, putEditCTDT, searchCTDTByName,
    getStudentByClassExam, searchClassExamsByName,
    getClassExams, Login, getClass, getClassbyCourse,
    getCourse, getTeachers, getStudentByCTDTAPI, getStudentAPI,
    getAllCTDT } = require('../controller/mainController')
//Trang chủ
routerAPI.get('/main', middleware.verifyToken, getMain)
//Login
routerAPI.get('/', Login)
routerAPI.post('/login', loginUser);
routerAPI.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});
const User = require('../models/user');
const CTDT = require('../models/ctdt');

routerAPI.get('/profile', middleware.verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('idCtdt').exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Construct image path based on mssv and stored image filename
        const imagePath = user.image ? `/img/avt/${user.image}` : '/img/avt/default.jpg';

        res.render('build/pages/profile.ejs', {
            user: user,
            imagePath: imagePath
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


// routerAPI.get('/profile', middleware.verifyToken, middleware.roleAdmin, async (req, res) => {
//     return res.json({
//         info: req.user
//     });
//     // res.render('build/index.ejs')
// });
//Khoa viện
routerAPI.get('/ctdts', middleware.verifyToken, getAllCTDT)
routerAPI.get('/ctdtsSearchName', searchCTDTByName);
routerAPI.put('/ctdts/:id', putEditCTDT); // PUT route to update data
//Sinh viên/ giáo viên
routerAPI.get('/students', middleware.verifyToken, getStudentAPI)
routerAPI.get('/students/ctdts', getStudentByCTDTAPI)
routerAPI.get('/studentSearchName', searchStudentByName);
routerAPI.put('/students/:id', async (req, res) => {
    const id = req.params.id;
    const newData = req.body;

    try {
        const updatedData = await User.findByIdAndUpdate(id, newData, { new: true });
        res.status(200).json(updatedData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}),

    routerAPI.get('/teachers', getTeachers)
routerAPI.get('/teacherSearch', searchTeacher)

//Khóa học
routerAPI.get('/courses', getCourse)
routerAPI.get('/courses/:idCourse', getClassbyCourse)
//Lớp học
routerAPI.get('/class', getClass)
//Lớp thi
routerAPI.get('/classExams', getClassExams)
routerAPI.post('/classExams/search', searchClassExamsByName);
routerAPI.get('/classExamsStudents/:idClassExam', getStudentByClassExam);
// Route để xử lý yêu cầu thêm mới dữ liệu
routerAPI.post('/ctdts', postNewCTDT);
// Route để xử lý yêu cầu xóa dữ liệu dựa trên _id
routerAPI.delete('/ctdts/:id', deleteACTDT);




//Điểm danh lớp thi
const faceController = require('../controller/faceController');
routerAPI.post('/post-face', faceController.postFace);
routerAPI.post('/check-face', faceController.checkFace);

routerAPI.get('/faceCheckAttend', faceController.renderForm);
routerAPI.get('/faceCheckAttend/:idClassExam', faceController.renderForm);
routerAPI.post('/check-face/:idClassExam', faceController.checkFaceByClassExam);
routerAPI.get('/get-recognized-name/:userId', faceController.getFaceByName);








// routerAPI.get('/', getHomePage)
routerAPI.get('/data', getData)


routerAPI.get('/users', getUsersAPI)
routerAPI.get('/users/:iduser', getUserAPIById)
routerAPI.post('/users', postCreateUserAPI)
routerAPI.put('/users', putUpdateUserAPI)
routerAPI.delete('/users', deleteUserAPI)
routerAPI.post('/usersFile', postImageUser)

routerAPI.post('/ctdts', postCreateCTDT)
routerAPI.delete('/ctdts', deleteCTDT)
routerAPI.put('/ctdts', updateCTDT)

routerAPI.post('/course', postCreateCourse)
routerAPI.get('/course', getAllCourse)
routerAPI.delete('/course', deleteCourse)
routerAPI.put('/course', updateCourse)

routerAPI.post('/classes', postCreateClass)
routerAPI.get('/classes', getAllClass)
routerAPI.delete('/classes', deleteClass)
routerAPI.put('/classes', updateClass)

routerAPI.post('/class-exam', postCreateClassExam)
routerAPI.get('/class-exam', getAllClassExam)
routerAPI.delete('/class-exam', deleteClassExam)
routerAPI.put('/class-exam', updateClassExam)

routerAPI.post('/kqht', postCreateKqht)
routerAPI.get('/kqht', getAllKqht)
routerAPI.delete('/kqht', deleteKqht)
routerAPI.put('/kqht', updateKqht)







module.exports = routerAPI;