import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Worker } from '../worker/worker.model';

@Entity({
  name: 'tasks',
})
export class Task {
  /**
   * id of a task
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * task job description
   */
  @Column({
    type: 'text',
  })
  job: string;

  /**
   * true when task already done
   */
  @Column({
    type: 'boolean',
    default: false,
  })
  done: boolean;

  /**
   * true when task canceled
   */
  @Column({
    type: 'boolean',
    default: false,
  })
  cancelled: boolean;

  /**
   * task attachment
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  attachment: string;

  /**
   * time logged when adding new task
   */
  @Column({
    type: 'timestamp',
    name: 'added_at',
    nullable: false,
    default: () => 'NOW()',
  })
  addedAt: Date;

  /**
   * worker assigned for this task
   */
  @ManyToOne(() => Worker, {
    onDelete: 'CASCADE',
  })
  assignee: Worker;
}
