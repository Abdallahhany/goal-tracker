import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'date' })
  deadline: string;

  @Index()
  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: false })
  completed: boolean;

  @Column()
  order: number;

  @Index()
  @Column({ nullable: true, type: 'uuid' })
  publicId: string | null;

  // ManyToOne relation to User (owner)
  @ManyToOne(() => User, (user) => user.goals, { onDelete: 'CASCADE' })
  owner: User;

  @Column()
  ownerId: string;

  // Self-referencing many-to-one (parent)
  @ManyToOne(() => Goal, (goal) => goal.children, { nullable: true, onDelete: 'CASCADE' })
  parent: Goal;

  @Column({ nullable: true })
  parentId: string;

  // Inverse one-to-many
  @OneToMany(() => Goal, (goal) => goal.parent)
  children: Goal[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
