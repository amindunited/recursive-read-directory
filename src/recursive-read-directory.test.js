/**
 * @license
 * Copyright Robin Buckley. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
'use strict';

const fs = require('fs');
const readDir = require('./index');
const expect = require('chai').expect
const testHelpers = require('../tests/test-helpers');// ('../../../tests/test-helpers');

const mkdirPromise = testHelpers.mkdirPromise;
const writeFilePromise = testHelpers.writeFilePromise;
const removeFilePromise = testHelpers.removeFilePromise;
const removeDirectoryPromise = testHelpers.removeDirectoryPromise;

describe('Recursive Read Directory ', () => {

  before((done) => {

    mkdirPromise('./test_dir')
      .then(() => mkdirPromise('./test_dir/dir_1'))
      .then(() => mkdirPromise('./test_dir/dir_2'))
      .then(() => mkdirPromise('./test_dir/dir_2/dir_a'))
      .then(() => {
        const promises = [
          writeFilePromise('./test_dir/file_1.txt', 'File One'),
          writeFilePromise('./test_dir/file_2.txt', 'File Two'),
          writeFilePromise('./test_dir/file_3.txt', 'File Three'),
          writeFilePromise('./test_dir/dir_1/file_a.txt', 'File A'),
          writeFilePromise('./test_dir/dir_1/file_b.txt', 'File B'),
          writeFilePromise('./test_dir/dir_1/file_c.txt', 'File C'),
          writeFilePromise('./test_dir/dir_2/file_7.txt', 'File Seven'),
          writeFilePromise('./test_dir/dir_2/file_8.txt', 'File Eight'),
          writeFilePromise('./test_dir/dir_2/file_9.txt', 'File Nine'),
          writeFilePromise('./test_dir/dir_2/dir_a/file_x.txt', 'File X'),
          writeFilePromise('./test_dir/dir_2/dir_a/file_y.txt', 'File Y'),
          writeFilePromise('./test_dir/dir_2/dir_a/file_z.txt', 'File Z')
        ];
        Promise.all(promises)
          .then(function() { done() });
      });
  });

  after((done) => {
    const promises = [
      removeFilePromise('./test_dir/file_1.txt'),
      removeFilePromise('./test_dir/file_2.txt'),
      removeFilePromise('./test_dir/file_3.txt'),
      removeFilePromise('./test_dir/dir_1/file_a.txt'),
      removeFilePromise('./test_dir/dir_1/file_b.txt'),
      removeFilePromise('./test_dir/dir_1/file_c.txt'),
      removeFilePromise('./test_dir/dir_2/file_7.txt'),
      removeFilePromise('./test_dir/dir_2/file_8.txt'),
      removeFilePromise('./test_dir/dir_2/file_9.txt'),
      removeFilePromise('./test_dir/dir_2/dir_a/file_x.txt'),
      removeFilePromise('./test_dir/dir_2/dir_a/file_y.txt'),
      removeFilePromise('./test_dir/dir_2/dir_a/file_z.txt')
    ];
    Promise.all(promises)
      .then(() => removeDirectoryPromise('./test_dir/dir_2/dir_a'))
      .then(() => removeDirectoryPromise('./test_dir/dir_2'))
      .then(() => removeDirectoryPromise('./test_dir/dir_1'))
      .then(() => removeDirectoryPromise('./test_dir'))
      .then(function() { done() });
  });

  it('should export a function', () => {
    expect(readDir).to.be.a('function');
  });

  it('should reject when given a bad path ', (done) => {
    readDir('./no_test_dir')
      .then((files) => {
        expect(false).to.be.true;
        done();
      }, (err) => {
        expect(true).to.be.true;
        done();
      })
  });

  it('should return the directory contents ', (done) => {
    readDir('./test_dir')
      .then((files) => {
        // We don't test the whole directroy structure because there *might* be sys files there (.DS_store)
        expect(files.indexOf('dir_1')).to.be.greaterThan(-1);
        expect(files.indexOf('dir_2',)).to.be.greaterThan(-1);
        expect(files.indexOf('file_1.txt')).to.be.greaterThan(-1);
        done();
      }, (err) => {
        done();
      }).catch((err) => {
        done();
      });
  });

  it('should return the contents of child directories', (done) => {
    readDir('./test_dir')
      .then((files) => {
        // We don't test the whole directroy structure because there *might* be sys files there (.DS_store)
        expect(files.indexOf('dir_1')).to.be.greaterThan(-1);
        expect(files.indexOf('./test_dir/dir_2/dir_a/file_x.txt')).to.be.greaterThan(-1);
        expect(files.indexOf('./test_dir/dir_2/file_9.txt')).to.be.greaterThan(-1);
        done();
      }, (err) => {
        done();
      }).catch((err) => {
        done();
      });
  });

});
