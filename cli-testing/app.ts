



interface User {
    id: number;        
    name: string;      
    email: string;     
    active: boolean;   
}


class UserService {
    
    private users: User[] = [];

    
    addUser(user: User): void {
        
        if (!user.name || !user.email) {
            throw new Error('Invalid user data');
        }

        
        this.users.push(user);
    }

    
    getUserById(id: number): User | undefined {
        
        return this.users.find(user => user.id === id);
    }

    
    getActiveUsers(): User[] {
        
        return this.users.filter(user => user.active);
    }
}


export { UserService, User };


