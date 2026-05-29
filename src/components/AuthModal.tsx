import { useState, type FormEvent } from "react";
import "./AuthModal.css";

type Props = {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onClose: () => void;
};

export default function AuthModal({ onSignIn, onSignUp, onClose }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      if (mode === "signin") {
        await onSignIn(email, password);
        onClose();
      } else {
        await onSignUp(email, password);
        setMessage("확인 이메일을 보냈습니다. 메일함을 확인해 주세요.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-modal__backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal__close" onClick={onClose} aria-label="닫기">✕</button>
        <h2 className="auth-modal__title">
          {mode === "signin" ? "로그인" : "회원가입"}
        </h2>

        {message ? (
          <p className="auth-modal__message">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="auth-modal__form">
            <label className="auth-modal__label">
              이메일
              <input
                className="auth-modal__input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                disabled={loading}
              />
            </label>
            <label className="auth-modal__label">
              비밀번호
              <input
                className="auth-modal__input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6자 이상"
                minLength={6}
                required
                disabled={loading}
              />
            </label>
            {error && <p className="auth-modal__error">{error}</p>}
            <button className="auth-modal__submit" type="submit" disabled={loading}>
              {loading ? "처리 중…" : mode === "signin" ? "로그인" : "가입하기"}
            </button>
          </form>
        )}

        <p className="auth-modal__switch">
          {mode === "signin" ? (
            <>계정이 없으신가요? <button onClick={() => { setMode("signup"); setError(""); }}>회원가입</button></>
          ) : (
            <>이미 계정이 있으신가요? <button onClick={() => { setMode("signin"); setError(""); }}>로그인</button></>
          )}
        </p>
      </div>
    </div>
  );
}
