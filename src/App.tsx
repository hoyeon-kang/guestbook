import { useCallback, useEffect, useState } from "react";
import {
  insertGuestbookEntry,
  listGuestbookEntries,
} from "./services/guestbookService";
import type {
  GuestbookEntry,
  GuestbookInsertPayload,
} from "./types/guestbook";
import GuestbookForm from "./components/GuestbookForm";
import GuestbookList from "./components/GuestbookList";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./hooks/useAuth";
import "./App.css";

export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listGuestbookEntries()
      .then((data) => { if (!cancelled) setEntries(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleAdd = useCallback(
    async (payload: GuestbookInsertPayload) => {
      const entry = await insertGuestbookEntry(payload);
      setEntries((prev) => [entry, ...prev]);
    },
    []
  );

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">방명록</h1>
        <p className="app__subtitle">이름과 한마디를 남겨 주세요.</p>
        {!authLoading && (
          <div className="app__auth">
            {user ? (
              <>
                <span className="app__user-email">{user.email}</span>
                <button className="app__auth-btn app__auth-btn--out" onClick={signOut}>
                  로그아웃
                </button>
              </>
            ) : (
              <button className="app__auth-btn" onClick={() => setShowAuth(true)}>
                로그인
              </button>
            )}
          </div>
        )}
      </header>

      <main className="app__main">
        {user ? (
          <GuestbookForm onSubmit={handleAdd} />
        ) : (
          <div className="app__login-prompt">
            <p>글을 남기려면 로그인이 필요합니다.</p>
            <button className="app__auth-btn" onClick={() => setShowAuth(true)}>
              로그인 / 회원가입
            </button>
          </div>
        )}
        <GuestbookList entries={entries} loading={loading} />
      </main>

      {showAuth && (
        <AuthModal
          onSignIn={signIn}
          onSignUp={signUp}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}
