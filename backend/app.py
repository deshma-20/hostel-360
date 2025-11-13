from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, Complaint
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# Ensure the instance folder exists
try:
    os.makedirs(app.instance_path)
except OSError:
    pass

CORS(app)

# ✅ Database configuration
# Use an absolute path for the database URI
db_path = os.path.join(app.instance_path, 'database.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'uploads')

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# ✅ Initialize the database
db.init_app(app)

# ✅ Root route
@app.route('/')
def home():
    return app.response_class(
    response='{"message": "Backend running successfully 🚀"}',
    status=200,
    mimetype='application/json; charset=utf-8'
)



# ✅ Registration route
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not all([name, email, username, password, role]):
        return jsonify({'error': 'All fields are required'}), 400

    # Check if user already exists
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(
        name=name,
        email=email,
        username=username,
        password=hashed_password,
        role=role
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully ✅'}), 201


# ✅ Login route
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not all([username, password]):
        return jsonify({'error': 'Username and password are required'}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid username or password'}), 401

    return jsonify({
        'message': 'Login successful 🎉',
        'id': user.id,
        'role': user.role,
        'username': user.username,
        'name': user.name,
        'token': 'dummy-token' # Sending a dummy token for now
    })

# ✅ Complaints routes
@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    complaints = Complaint.query.order_by(Complaint.created_at.desc()).all()
    return jsonify([c.to_dict() for c in complaints])

@app.route('/api/complaints', methods=['POST'])
def create_complaint():
    data = request.form
    
    # Basic validation
    if not all([data.get('category'), data.get('description'), data.get('location'), data.get('userId')]):
        return jsonify({'error': 'Missing required fields'}), 400

    user = User.query.get(data.get('userId'))
    if not user:
        return jsonify({'error': 'Invalid user'}), 400

    attachment_url = None
    if 'file' in request.files:
        file = request.files['file']
        if file.filename != '':
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            attachment_url = f'/{file_path}'

    new_complaint = Complaint(
        category=data.get('category'),
        description=data.get('description'),
        location=data.get('location'),
        room_number=data.get('roomNumber'),
        status='pending',
        attachment_url=attachment_url,
        user_id=user.id
    )
    db.session.add(new_complaint)
    db.session.commit()
    
    return jsonify(new_complaint.to_dict()), 201

@app.route('/api/complaints/<int:id>', methods=['DELETE'])
def delete_complaint(id):
    complaint = Complaint.query.get_or_404(id)
    db.session.delete(complaint)
    db.session.commit()
    return jsonify({'message': 'Complaint deleted successfully'}), 200

# ✅ Run the Flask app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create the database tables if they don’t exist
    app.run(debug=True)
