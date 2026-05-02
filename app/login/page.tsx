import LoginForm from "./ui";

export default function LoginPage() {
  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <h1>Curator Login</h1>
          <p>Sign in to manage saved visuals.</p>
        </div>
      </header>
      <LoginForm />
    </main>
  );
}
