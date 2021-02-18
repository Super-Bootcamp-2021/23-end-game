import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'workers',
})
export class Worker {
  /**
   * id of a worker
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * worker name
   */
  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  /**
   * worker age
   */
  @Column({
    type: 'int',
  })
  age: number;

  /**
   * worker short biography
   */
  @Column({
    type: 'text',
  })
  bio: string;

  /**
   * worker address
   */
  @Column({
    type: 'text',
  })
  address: string;

  /**
   * worker profile photo
   */
  @Column({
    type: 'varchar',
    length: 255,
  })
  photo: string;
}
