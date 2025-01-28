import { useParams } from "react-router-dom";

const UserPage = () => {
  const { username } = useParams();

  return (
    <div className="user-page">
      <h1>Welcome, {username}!</h1>
      <p>This is your personalized dashboard.</p>
    </div>
  );
};

export default UserPage;
