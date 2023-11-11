#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
const log = console.log, success = (...message) => { log(chalk.green(message)); }, info = (...message) => { log(chalk.green(message)); }, error = (...message) => { log(chalk.green(message)); };
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["Pending"] = "Pending";
    StudentStatus["Enrolled"] = "Enrolled";
    StudentStatus["Graduated"] = "Graduated";
})(StudentStatus || (StudentStatus = {}));
/**
 * Class implementation for course
 */
class Course {
    get courseId() {
        return this._courseId;
    }
    get title() {
        return this._title;
    }
    constructor(title) {
        this._title = title;
        this._courseId = Course.generateId();
    }
    static generateId() {
        return ++Course.uniqueId;
    }
}
Course.uniqueId = 1000;
/**
 * Class implementation for student
 */
class Student {
    static get uniqueId() {
        return this._uniqueId;
    }
    get studentId() {
        return this._studentId;
    }
    get name() {
        return this._name;
    }
    get balance() {
        return this._balance;
    }
    get status() {
        return this._status;
    }
    get courses() {
        return this._courses;
    }
    constructor(name, balance, status, courses) {
        this._studentId = Student.generateUniqueId();
        this._name = name;
        this._balance = balance;
        this._status = status;
        this._courses = courses;
    }
    static generateUniqueId() {
        return ++Student._uniqueId;
    }
    updateStatus(status) {
        this._status = status;
    }
    enrollInCourse(course) {
        this._courses.push(course);
    }
    payFee() {
        const balance = this.balance;
        this._balance = 0;
        success(`Tuition fee of ${balance} paid against student: ${this.name}`);
    }
}
Student._uniqueId = 1000;
const courses = [];
const students = [];
function addNewStudent() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Enter Student Name:"
        },
        {
            name: "balance",
            type: "input",
            message: "Enter Student Fee:",
            validate(input) {
                let parsedValue = parseFloat(input);
                return !isNaN(parsedValue) && parsedValue > 0;
            },
            default: 100
        }
    ]).then(({ name, balance }) => {
        const student = new Student(name, balance, StudentStatus.Pending, []);
        students.push(student);
        info(`A new student is created.`);
        log(student);
        chooseAction();
    });
}
function enrollStudent() {
    inquirer.prompt([
        {
            name: "student",
            type: "list",
            message: "Select student:",
            choices: students.map(student => { return { name: `${student.studentId} - ${student.name}`, value: student }; })
        },
        {
            name: "course",
            type: "list",
            message: "Select course:",
            choices: courses.map(course => { return { name: course.title, value: course }; })
        }
    ]).then(({ student, course }) => {
        student.enrollInCourse(course);
        success(`Student ${student.name} is enrolled in course ${course.title}`);
        student.updateStatus(StudentStatus.Enrolled);
        chooseAction();
    });
}
function addNewCourse() {
    inquirer.prompt({
        name: "title",
        type: "input",
        message: "Enter Course Title",
        validate(input) {
            return input != "";
        }
    }).then(({ title }) => {
        const course = new Course(title);
        courses.push(course);
        success(`A new course added to listing:`);
        log(course);
        chooseAction();
    });
}
function payTuitionFee() {
    inquirer.prompt([
        {
            name: "student",
            type: "list",
            message: "Select student to pay Fee:",
            choices: students.map(student => { return { name: `${student.studentId} - ${student.name}`, value: student }; })
        }
    ]).then(({ student }) => {
        student.payFee();
        chooseAction();
    });
}
function chooseAction() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "Choose an action:",
        choices: [
            "View Students", "Add New Student", "Enroll Student",
            "View Courses", "Add New Course",
            "Pay Student Fee",
            "Exit"
        ]
    }).then(({ action }) => {
        switch (action) {
            case "View Students":
                info('Students:');
                log(students);
                chooseAction();
                break;
            case "Add New Student":
                addNewStudent();
                break;
            case "Enroll Student":
                enrollStudent();
                break;
            case "View Courses":
                info("Courses");
                log(courses);
                chooseAction();
                break;
            case "Add New Course":
                addNewCourse();
                break;
            case "Pay Student Fee":
                payTuitionFee();
                break;
            case "Exit":
                info("Thank you for using the app");
                break;
        }
    });
}
function studentManagementSystem() {
    // create new courses on startup
    const coursesArray = ["CS101", "MTH301", "CS201", "MGT101", "ECO201"];
    coursesArray.forEach(course => {
        courses.push(new Course(course));
    });
    chooseAction();
}
studentManagementSystem();
