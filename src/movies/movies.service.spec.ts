import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll()', () => {
    it('should return a array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne()', () => {
    it('should return a movie', () => {
      service.create({
        title: 'Test',
        genres: ['action', 'humor'],
        year: 2000,
      });
      const result = service.getOne(1);
      expect(result).toBeDefined();
      expect(result.id).toEqual(1);
    });
    it('should throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        //Check Test Expected and Received
        // expect(e.message).toEqual(`Movie with ID 999 not Found.`);
      }
    });
  });

  describe('deleteOne', () => {
    it('delete a movie', () => {
      service.create({
        title: 'Test1',
        genres: ['action', 'humor', 'drama'],
        year: 2020,
      });
      console.log(service.getAll());
      const allResult = service.getAll();
      service.deleteOne(1);
      const afterResult = service.getAll();
      expect(afterResult.length).toEqual(allResult.length - 1);
    });
    it('should return 404', () => {
      try {
        service.deleteOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('should create movie', () => {
      const beforeCreate = service.getAll().length;
      service.create({
        title: 'Test2',
        genres: ['humor', 'drama'],
        year: 2022,
      });
      const afterCreate = service.getAll().length;
      console.log(beforeCreate, afterCreate);
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      service.create({
        title: 'Test3',
        genres: ['humor', 'drama'],
        year: 2023,
      });
      service.update(1, { title: 'update movie' });
      const movie = service.getOne(1);
      expect(movie.title).toEqual('update movie');
    });
    it('should return 404', () => {
      try {
        service.update(999, {});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
