import random
from datetime import datetime, timedelta
import os

strings = ['asd', 'asds', 'asdas', 'cvcb', 'dsbb']

'''
tables = ["Customers", "Orders", "Products", "Categories", "OrderItems"]
Customers = ["customer_id", 'first_name', 'last_name', 'email', 'phone_number', 'address']
Orders = ['order_id', 'customer_id', 'order_date', 'total_amount', 'payment_method', 'shipping_address']
Products = ['product_id', 'product_name', 'category', 'price', 'description', 'quantity']
Categories = ['category_id', 'category_name', 'description', 'parent_category_id']
OrderItems = ['order_item_id', 'order_id', 'product_id', 'quantity', 'unit_price']
'''

''''
tables = ["Employees", "Departments", "Projects", "Tasks", "Timesheets"]
Employees = ['employee_id', 'first_name', 'last_name', 'email', 'phone_number', 'hire_date', 'job_title', 'department', 'salary']
Departments = ['department_id', 'department_name', 'manager_id', 'location', 'budget']
Projects = ['project_id', 'project_name', 'start_date', 'end_date', 'status', 'budget', 'department_id']
Tasks = ['task_id', 'task_name', 'description', 'start_date', 'end_date', 'status', 'project_id', 'employee_id']
Timesheets = ['timesheet_id', 'employee_id', 'project_id', 'task_id', 'date', 'hours_worked']
'''

tables = ["Books", "Authors", "Publishers", "Customers", "Orders"]
Books = ['book_id', 'title', 'author', 'publication_date', 'publisher', 'price', 'category_id']
Authors = ['author_id', 'first_name', 'last_name', 'birth_date', 'country']
Publishers = ['publisher_id', 'publisher_name', 'established_date', 'country', 'website']
Customers = ['customer_id', 'first_name', 'last_name', 'email', 'phone_number', 'address','city', 'state', 'zip_code', 'country']
Orders = ['order_id', 'customer_id', 'order_date', 'total_amount', 'status', 'shipping_address','shipping_city', 'shipping_state', 'shipping_zip_code', 'shipping_country']

'''
tables = ["Students", "Courses", "Enrollments", "Instructors", "Departments"]
Students = [
    'student_id', 'first_name', 'last_name', 'email', 'date_of_birth', 'address',
    'city', 'state', 'zip_code', 'country', 'enrollment_date'
]
Courses = [
    'course_id', 'course_name', 'course_code', 'department', 'credits',
    'instructor_id', 'start_date', 'end_date'
]
Enrollments = [
    'enrollment_id', 'student_id', 'course_id', 'enrollment_date', 'grade'
]
Instructors = [
    'instructor_id', 'first_name', 'last_name', 'email', 'phone_number', 'department'
]
Departments = [
    'department_id', 'department_name', 'location', 'head_id'
]
'''

'''
tables = ["Movies", "Actors", "Reviews", "Theaters", "Screenings"]
Movies = [
    'movie_id', 'title', 'release_date', 'genre', 'director', 'duration', 'rating'
]
Actors = [
    'actor_id', 'first_name', 'last_name', 'date_of_birth', 'gender', 'nationality'
]
Reviews = [
    'review_id', 'movie_id', 'user_id', 'rating', 'comment', 'review_date'
]
Theaters = [
    'theater_id', 'theater_name', 'location', 'capacity', 'phone_number'
]
Screenings = [
    'screening_id', 'movie_id', 'theater_id', 'start_time', 'end_time', 'ticket_price'
]
'''

conditions = {
        "Books": "book_id = ",
        "Authors": "author_id = ",
        "Publishers": "publisher_id = ",
        "Customers": "customer_id = ",
        "Orders": "order_id = "
    }

file_path = "generated_statements.txt"
file = open(file_path, "w")
newline = os.linesep

for i in range(1, 1000):
    table = random.choice(tables)
    condition = conditions['Authors'] + str(random.randint(1, 9999))
    columns = globals()[table]
    column = random.choice(columns)
    user = random.randint(1,15)
    # Get the current date
    current_date = datetime.now()
    # # Calculate the start date as 3 months ago from the current date
    start_date = current_date - timedelta(days=3*30)
    # Generate a random number of days within the 3-month period
    random_days = random.randint(0, (current_date - start_date).days)
    # Calculate the random start date
    issuedAt = start_date + timedelta(days=random_days)
    finishedAt = issuedAt + timedelta(seconds=random.randint(1, 4))
    price = random.randint(1,20)
    number = random.randint(111, 90000)
    randString = random.choice(strings)
    randomdate = timedelta(hours=random.randint(1, 3))
    insertInto_statement = f"INSERT INTO 'Authors' ('author_id', 'first_name', 'last_name', 'birth_date', 'country') \n VALUES ( '{i}', '{randString}', '{randString}', '{start_date}', '{randString}')"
    raw_statement = f"INSERT INTO Authors (author_id, first_name, last_name, birth_date, country) \n VALUES ( {i}, {randString}, {randString}, {start_date}, {randString})"

    insert_statement = """
    INSERT INTO "SqlQuery" ("queryId", "userId", "issuedAt", "finishedAt", "hasError", "errorMessage", "statement", "projectId", "queryTypeId")
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
    """
    values = (i, user, issuedAt, finishedAt, False, None, raw_statement, 3, 2)
    formatted_insert_statement = insert_statement.strip().replace("%s", "'%s'") % values

    insert_ColumnAccess = """
    INSERT INTO "QueryColumnAccess" ("queryId", "columnId")
    VALUES (%s, %s);
    """
    values = (i, 1)
    formatted_insert_ColumnAccess = insert_ColumnAccess.strip().replace("%s", "'%s'") % values

    insert_ColumnAccess2 = """
    INSERT INTO "QueryColumnAccess" ("queryId", "columnId")
    VALUES (%s, %s);
    """
    values = (i, 2)
    formatted_insert_ColumnAccess2 = insert_ColumnAccess2.strip().replace("%s", "'%s'") % values

    insert_ColumnAccess3 = """
    INSERT INTO "QueryColumnAccess" ("queryId", "columnId")
    VALUES (%s, %s);
    """
    values = (i, 3)
    formatted_insert_ColumnAccess3 = insert_ColumnAccess3.strip().replace("%s", "'%s'") % values

    insert_ColumnAccess4 = """
    INSERT INTO "QueryColumnAccess" ("queryId", "columnId")
    VALUES (%s, %s);
    """
    values = (i, 4)
    formatted_insert_ColumnAccess4 = insert_ColumnAccess4.strip().replace("%s", "'%s'") % values

    insert_ColumnAccess5 = """
    INSERT INTO "QueryColumnAccess" ("queryId", "columnId")
    VALUES (%s, %s);
    """
    values = (i, 5)
    formatted_insert_ColumnAccess5 = insert_ColumnAccess5.strip().replace("%s", "'%s'") % values

    insert_TableAccess = """
    INSERT INTO "QueryTableAccess" ("queryId", "tableId")
    VALUES (%s, %s);
    """
    values = (i, 2)
    formatted_TableAccess = insert_TableAccess.strip().replace("%s", "'%s'") % values

    if(i == 1):
        print(newline)

    file.write(insertInto_statement + newline)
    file.write(formatted_insert_statement + newline)
    file.write(formatted_insert_ColumnAccess + newline)
    file.write(formatted_insert_ColumnAccess2 + newline)
    file.write(formatted_insert_ColumnAccess3 + newline)
    file.write(formatted_insert_ColumnAccess4 + newline)
    file.write(formatted_insert_ColumnAccess5 + newline)
    file.write(formatted_TableAccess + newline)

# Close the file
file.close()

# Return the file object
file = open(file_path, "r")
generated_statements = file.read()
file.close()