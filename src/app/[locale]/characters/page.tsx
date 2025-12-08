import CharacterList from '@/features/characters/components/CharacterList';
import AuthGuard from '@/features/auth/components/AuthGuard';

export default function CharactersPage() {
    return (
        <AuthGuard>
            <div className="">
                <CharacterList />
            </div>
        </AuthGuard>
    );
}