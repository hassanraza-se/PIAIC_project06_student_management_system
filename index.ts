#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";

const log = console.log,
    success = (...message: any[]) => {log(chalk.green(message))},
    info = (...message: any[]) => {log(chalk.green(message))},
    error = (...message: any[]) => {log(chalk.green(message))};

enum StudentStatus {
    Pending = "Pending",
    Enrolled = "Enrolled",
    Graduated = "Graduated"
}

/**
 * Class implementation for course
 */
class Course {
    get courseId(): number {
        return this._courseId;
    }
    get title(): string {
        return this._title;
    }
    private _title: string;
    private _courseId: number;
    private static uniqueId: number = 1000;

    constructor(title: string) {
        this._title = title;
        this._courseId = Course.generateId();
    }

    static generateId() {
        return ++Course.uniqueId
    }
}

/**
 * Class implementation for student
 */
class Student {
    static get uniqueId(): number {
        return this._uniqueId;
    }

    get studentId(): number {
        return this._studentId;
    }

    get name(): string {
        return this._name;
    }

    get balance(): number {
        return this._balance;
    }

    get status(): StudentStatus {
        return this._status;
    }

    get courses(): Course[] {
        return this._courses;
    }
    private static _uniqueId: number = 1000;
    private _studentId: number;
    private _name: string;
    private _balance: number;
    private _status: StudentStatus;
    private _courses: Course[];

    constructor(name: string, balance: number, status: StudentStatus, courses: Course[]) {
        this._studentId = Student.generateUniqueId();
        this._name = name;
        this._balance = balance;
        this._status = status;
        this._courses = courses;
    }

    static generateUniqueId() {
        return ++Student._uniqueId;
    }

    updateStatus(status: StudentStatus) {
        this._status = status;
    }
    enrollInCourse(course: Course) {
        this._courses.push(course);
    }
    payFee() {
        const balance = this.balance
        this._balance = 0;
        success(`Tuition fee of ${balance} paid against student: ${this.name}`)
    }
}

const courses: Course[] = [];
const students: Student[] = [];

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
            validate(input: any): boolean | string | Promise<boolean | string> {
                let parsedValue = parseFloat(input);
                return !isNaN(parsedValue) && parsedValue > 0
            },
            default: 100
        }
    ]).then(({name, balance}) => {
        const student: Student = new Student(name, balance, StudentStatus.Pending, []);
        students.push(student);
        info(`A new student is created.`);
        log(student);
        chooseAction();
    })
}
function enrollStudent() {
    inquirer.prompt([
        {
            name: "student",
            type: "list",
            message: "Select student:",
            choices: students.map( student => { return { name: `${student.studentId} - ${student.name}`, value: student } })
        },
        {
            name: "course",
            type: "list",
            message: "Select course:",
            choices: courses.map( course => { return { name: course.title, value: course } })
        }
    ]).then(({student, course}) => {
        student.enrollInCourse(course);
        success(`Student ${student.name} is enrolled in course ${course.title}`);
        student.updateStatus(StudentStatus.Enrolled);
        chooseAction();
    })
}
function addNewCourse() {
    inquirer.prompt({
        name: "title",
        type: "input",
        message: "Enter Course Title",
        validate(input: any): boolean | string | Promise<boolean | string> {
            return input != ""
        }
    }).then(({title}) => {
        const course = new Course(title);
        courses.push(course);
        success(`A new course added to listing:`);
        log(course);
        chooseAction();
    })
}

function payTuitionFee() {
    inquirer.prompt([
        {
            name: "student",
            type: "list",
            message: "Select student to pay Fee:",
            choices: students.map( student => { return { name: `${student.studentId} - ${student.name}`, value: student } })
        }
    ]).then(({student}) => {
        student.payFee();
        chooseAction();
    })
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
    }).then(({action}) => {
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
                info("Thank you for using the app")
                break;
        }
    });
}
function studentManagementSystem() {
    // create new courses on startup
    const coursesArray: string[] = ["CS101", "MTH301", "CS201", "MGT101", "ECO201"];
    coursesArray.forEach(course => {
        courses.push(new Course(course))
    });

    chooseAction();
}

studentManagementSystem();