/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlists_songs', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    playlists_id: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
  });

  pgm.addConstraint('playlists_songs', 'fk_playlists_songs.playlists_id_playlists.id', 'FOREIGN KEY(playlists_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlists_songs', 'fk_playlists_songs.song_id_musics.id', 'FOREIGN KEY(song_id) REFERENCES musics(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('playlists_songs');
  pgm.dropConstraint('playlists_songs', 'fk_playlists_songs.playlists_id_playlists.id');
  pgm.dropConstraint('playlists_songs', 'fk_playlists_songs.song_id_musics.id');
};
