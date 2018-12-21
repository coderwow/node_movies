import qiniu from 'qiniu';
import nanoid from 'nanoid';
import mongoose from 'mongoose';
import config from '../config';

const Movie = mongoose.model('Movie');

const bucket = config.qiniu.bucket;
const video_prefix = config.qiniu.video;
const AK = config.qiniu.AK;
const SK = config.qiniu.SK;

const mac = new qiniu.auth.digest.Mac(AK, SK);
const qiniu_config = new qiniu.conf.Config();
const bucketManager = new qiniu.rs.BucketManager(mac, qiniu_config);

const uploadToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
    bucketManager.fetch(url, bucket, key, (err, respBody, respInfo) => {
      if (err) {
        reject(err);
      } else {
        if (respInfo.statusCode === 200) {
          resolve({
            key
          });
        } else {
          reject(respInfo);
        }
      }
    });
  });
};

(async () => {
  let movies = await Movie.find({
    $or: [
      {
        videoKey: {
          $exists: false
        }
      },
      {
        videoKey: null
      },
      {
        videoKey: ''
      }
    ]
  });

  movies.map(async (movie) => {
    if (movie.video && !movie.key) {
      try {
        // console.log('开始上传 video');
        let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4');

        // console.log('开始上传 poster');
        let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png');

        // console.log('开始上传 cover');
        let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png');

        if (videoData.key) {
          movie.videoKey = videoData.key;
        }
        if (coverData.key) {
          movie.coverKey = coverData.key;
        }
        if (posterData.key) {
          movie.posterKey = posterData.key;
        }

        // console.log(movie);

        await movie.save();
      } catch (err) {
        console.log(err);
      }
    }
  });
})();
