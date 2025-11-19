import CharacterList from '@/features/characters/components/CharacterList';
import AuthGuard from '@/features/common/components/AuthGuard';

export default function CharactersPage() {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-background">
                <div className="max-w-md mx-auto">
                    <CharacterList />
                </div>
            </div>
        </AuthGuard>
    );
}