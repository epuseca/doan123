const { createKqht, getKqht, dKqht, uKqht } = require("../service/kqhtService")

const CTDT = require('../models/ctdt')
const User = require('../models/user')
const Course = require("../models/course")
const Class = require("../models/class")
const ClassExam = require("../models/classExam")
const classExam = require("../models/classExam")


module.exports = {
    getMain: async (req, res) => {
        res.render('build/index.ejs', {
            user: req.user
        });
    },
    getStudentAPI: async (req, res) => {
        let results = await CTDT.find({});
        return res.render('build/pages/student_management', { listCTDT: results })
    },
    getStudentByCTDTAPI: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 6; // Số lượng item trên mỗi trang
            const skip = (page - 1) * limit;

            const results = await User.find({ role: 'student' }).skip(skip).limit(limit);
            const totalStudents = await User.countDocuments({ role: 'student' });
            const totalPages = Math.ceil(totalStudents / limit);

            res.render('build/pages/listStudent', { listUserByCTDT: results, totalPages, currentPage: page });
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    searchStudentByName: async (req, res) => {
        const searchName = req.query.name || '';
        const searchMSSV = req.query.mssv || '';
        try {
            // Tạo truy vấn tìm kiếm
            const query = { role: 'student' };
            if (searchName) {
                query.name = { $regex: searchName, $options: 'i' };
            }
            if (searchMSSV) {
                query.mssv = { $regex: searchMSSV, $options: 'i' };
            }

            // Phân trang
            const page = parseInt(req.query.page) || 1;
            const limit = 6;
            const skip = (page - 1) * limit;

            // Lấy tài liệu khớp với phân trang
            const results = await User.find(query).skip(skip).limit(limit);
            const totalStudents = await User.countDocuments(query);
            const totalPages = Math.ceil(totalStudents / limit);

            return res.render('build/pages/listStudent.ejs', {
                listUserByCTDT: results,
                searchQuery: { name: searchName, mssv: searchMSSV },
                totalPages,
                currentPage: page
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    getAllCTDT: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 5; // Số lượng item trên mỗi trang
            const skip = (page - 1) * limit;

            const results = await CTDT.find({}).skip(skip).limit(limit);
            const totalCTDTs = await CTDT.countDocuments({});
            const totalPages = Math.ceil(totalCTDTs / limit);

            return res.render('build/pages/department_management.ejs', {
                listCTDT: results,
                totalPages,
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
                lastPage: totalPages,
                searchQuery: '' // Thêm biến searchQuery và thiết lập giá trị mặc định
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    searchCTDTByName: async (req, res) => {
        const searchQuery = req.query.name || '';
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        try {
            const query = { name: { $regex: searchQuery, $options: 'i' } };
            const results = await CTDT.find(query).skip(skip).limit(limit);
            const totalCTDTs = await CTDT.countDocuments(query);
            const totalPages = Math.ceil(totalCTDTs / limit);

            return res.render('build/pages/department_management.ejs', {
                listCTDT: results,
                searchQuery, // Truyền searchQuery vào view
                totalPages,
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
                lastPage: totalPages
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    putEditCTDT: async (req, res) => {
        const id = req.params.id;
        const newData = req.body;

        try {
            const updatedData = await CTDT.findByIdAndUpdate(id, newData, { new: true });
            res.status(200).json(updatedData);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    postNewCTDT: async (req, res) => {
        const newData = req.body;
        try {
            const createdData = await CTDT.create(newData);
            res.status(201).json(createdData); // Trả về dữ liệu mới đã được thêm vào
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    deleteACTDT: async (req, res) => {
        const id = req.params.id;

        try {
            // Xóa dữ liệu từ cơ sở dữ liệu dựa trên _id
            await CTDT.findByIdAndDelete(id);
            res.status(204).end(); // Trả về mã trạng thái 204 (No Content) khi xóa thành công
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    getTeachers: async (req, res) => {
        try {
            let results = await User.find({});
            // Lọc những người dùng có role là 'student'
            let teachers = results.filter(user => user.role === 'teacher');
            return res.render('build/pages/listLeturer', { listUserByCTDT: teachers });
        } catch (error) {
            console.error("Error fetching users:", error);
            return res.status(500).send("Internal Server Error");
        }
    },
    searchTeacher: async (req, res) => {
        const searchQuery = req.query.name || '';
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        try {
            // Tìm giảng viên theo tên với phân trang
            const query = {
                role: 'teacher',
                name: { $regex: searchQuery, $options: 'i' }
            };
            const results = await User.find(query).skip(skip).limit(limit);
            const totalTeachers = await User.countDocuments(query);
            const totalPages = Math.ceil(totalTeachers / limit);

            return res.render('build/pages/listLeturer', {
                listUserByCTDT: results,
                searchQuery,
                currentPage: page,
                totalPages
            });
        } catch (error) {
            console.error("Error searching for teachers:", error);
            return res.status(500).send("Internal Server Error");
        }
    },
    getCourse: async (req, res) => {
        let results = await Course.find({});
        return res.render('build/pages/course_management.ejs', { listCourse: results })
    },
    getClassbyCourse: async (req, res) => {
        const CourseID = req.params.idCourse;
        let results = await Class.find({ idCourse: CourseID }).exec();
        return res.render('build/pages/class_management.ejs', { listClassByCourse: results })
        // return res.status(200).json(
        //     {
        //         errorCode: 0,
        //         data: result
        //     }
        // )
    },
    getClass: async (req, res) => {
        let results = await Class.find({});
        return res.render('build/pages/class_management.ejs', { listClassByCourse: results })
    },
    Login: async (req, res) => {
        res.render('build/pages/sign-in.ejs')
    },
    getClassExams: async (req, res) => {
        try {
            let results = await ClassExam.find({})
                .populate({
                    path: 'classId',
                    populate: {
                        path: 'idCourse', // Populate idCourse from class
                        model: 'course' // Ensure the model is correct
                    }
                })
                .populate({
                    path: 'teacherId', // Populate teacherId to get teacher details
                    select: 'name' // Only select the 'name' field from the user document
                });


            return res.render('build/pages/classexams_management.ejs', { listClassExam: results });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    searchClassExamsByName: async (req, res) => {
        try {
            const { className } = req.body;

            let query = {};
            if (className) {
                query = { 'classId.name': { $regex: new RegExp(className, 'i') } };
            }

            let results = await ClassExam.find(query)
                .populate({
                    path: 'classId',
                    populate: {
                        path: 'idCourse',
                        model: 'course'
                    }
                })
                .populate({
                    path: 'teacherId',
                    select: 'name'
                });

            res.json(results);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    getStudentByClassExam: async (req, res) => {
        try {
            const { idClassExam } = req.params;
            let classExamData = await classExam.findById(idClassExam).populate('idStudents').populate('idStudentsDiemDanh');
            if (!classExamData) {
                return res.status(404).send("Class Exam not found");
            }

            // Tạo danh sách sinh viên duy nhất và đánh dấu trạng thái
            let uniqueStudents = new Map();

            classExamData.idStudents.forEach(student => {
                uniqueStudents.set(student._id.toString(), { ...student._doc, inClass: true, attended: false });
            });

            classExamData.idStudentsDiemDanh.forEach(student => {
                if (uniqueStudents.has(student._id.toString())) {
                    uniqueStudents.get(student._id.toString()).attended = true;
                } else {
                    uniqueStudents.set(student._id.toString(), { ...student._doc, inClass: false, attended: true });
                }
            });

            return res.render('build/pages/listStudentInClassExam.ejs', {
                listStudentByClassExam: Array.from(uniqueStudents.values())
            });
        } catch (error) {
            console.error("Error fetching class exam data:", error);
            return res.status(500).send("Internal Server Error");
        }
    }
}