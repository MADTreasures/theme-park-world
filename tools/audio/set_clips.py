# the clips of the sound set (read by build_set.py): id, source, role in the game, start and end in seconds, options
MUSIC = '--lufs -19 --peak -1.5 --hp 60 --kbps 56 --fi 80 --fo 450'
VOICE = '--rms -21 --peak -2 --fi 15 --fo 110 --hp 110 --kbps 56'
# ---- music at the carousel and the gentle rides: a street organ and a disc music box ----
clip('orgel-walzer', 'walzer', 'musicOrgan', 173.25, 233.35, MUSIC)      # three rounds of the barrel: the tune restarts every 20 s
clip('spieluhr-angot', 'angot', 'musicOrgan', 0.3, 35.6, MUSIC)
# ---- single laughs: sixteen different ones from one recording ----
for i, (a, b) in enumerate([(0.64, 2.30), (3.88, 4.94), (6.00, 7.10), (8.14, 9.00), (9.94, 10.90), (14.76, 16.62), (22.04, 22.94), (28.38, 29.64),
                            (31.84, 32.72), (37.16, 38.86), (42.66, 43.76), (44.94, 46.98), (49.34, 50.60), (51.78, 54.12), (56.08, 57.80), (60.10, 61.46)]):
    clip('lachen-%02d' % (i + 1), 'lachen', 'laugh', max(0, a - 0.05), b + 0.2, VOICE)
clip('spieluhr-kreuz', 'kreuz', 'musicOrgan', 0.8, 34.2, MUSIC)
# ---- a whole group laughing ----
clip('gruppe-lachen', 'publikum', 'laughGroup', 0.0, 5.3, '--rms -22 --peak -2 --fi 15 --fo 600 --hp 110 --kbps 56')
# ---- cheers (for drops and wild rides) and applause (after the shows) ----
CHEER = '--rms -20 --peak -1.5 --fi 20 --fo 180 --hp 120 --kbps 56'
clip('jubel-1', 'klatschen', 'cheer', 6.5, 9.05, CHEER)
clip('jubel-2', 'klatschen', 'cheer', 9.0, 11.35, CHEER)
clip('jubel-3', 'hurra', 'cheer', 0.05, 3.35, CHEER)
clip('applaus-1', 'klatschen', 'applause', 0.0, 6.3, '--rms -22 --peak -2 --fi 20 --fo 500 --hp 120 --kbps 56')
# ---- the crowd: one recording of a festival crowd, two different passages. Near and dense for busy paths; the other passage
#      without its treble, as a crowd sounds from a distance, for places where little is going on. Below 250 Hz the recording
#      holds a dull thump (probably a stage far away), which is filtered out. ----
loop('menge-dicht', 'festival', 'bedHigh', 4.0, 21.0, '--xf 1.5 --rms -24 --peak -4 --hp 250 --lp 9000 --kbps 48')
loop('menge-fern', 'festival', 'bedLow', 41.0, 17.0, '--xf 1.5 --rms -26 --peak -6 --hp 250 --lp 1800 --kbps 40')
# ---- lively music for the fast rides: the can-can, two different passages (first statement; reprise and finale) ----
clip('cancan-1', 'cancan', 'musicLively', 16.9, 53.5, '--lufs -19 --peak -1.5 --hp 50 --kbps 56 --fi 60 --fo 700')
clip('cancan-2', 'cancan', 'musicLively', 61.5, 106.7, '--lufs -19 --peak -1.5 --hp 50 --kbps 56 --fi 400 --fo 200')
# ---- laughs of other people ----
clip('lachen-17', 'prusten', 'laugh', 0.15, 3.5, VOICE)
clip('lachen-18', 'prusten', 'laugh', 4.15, 7.25, VOICE)
clip('lachen-19', 'prusten', 'laugh', 9.45, 12.1, VOICE)
# ---- excited screams for the drops: two people (a high scream and a boy's long yell), alone and as groups of several riders ----
SCREAM = '--rms -20 --peak -1.5 --fi 10 --fo 160 --hp 150 --kbps 56'
BOY = ('junge', 1.9, 4.15)
clip('schrei-1', 'schrei', 'scream', 0.05, 2.3, SCREAM)
clip('schrei-2', 'junge', 'scream', 1.9, 4.15, '--rms -20 --peak -1.5 --fi 60 --fo 260 --hp 150 --kbps 56')
layer('schrei-3', 'schrei', 'scream', 0.05, 2.3, [(0.8, 0, 0)], SCREAM)
layer('schrei-gruppe-1', 'schrei', 'scream', 0.05, 2.3, [(0.86, 0.0, 0), (1.0, 0.14, -2), (1.06, 0.05, -1, 1), (1.3, 0.2, -4, 1)], SCREAM, second=BOY)
layer('schrei-gruppe-2', 'schrei', 'scream', 0.05, 2.3, [(0.74, 0.06, -2), (0.95, 0.0, 0), (1.12, 0.22, -4), (0.92, 0.1, -1, 1), (1.18, 0.0, -2, 1)], SCREAM, second=BOY)
layer('schrei-gruppe-3', 'schrei', 'scream', 0.05, 2.3, [(0.9, 0.08, -1), (1.0, 0.0, 0, 1), (1.24, 0.12, -3, 1), (1.5, 0.3, -6, 1)], SCREAM, second=BOY)
# ---- more laughs of other people ----
clip('lachen-20', 'gelaechter', 'laugh', 0.0, 4.85, VOICE)
clip('lachen-21', 'gelaechter', 'laugh', 5.15, 6.55, VOICE)
clip('lachen-22', 'gelaechter', 'laugh', 6.75, 8.55, VOICE)
clip('lachen-23', 'gelaechter', 'laugh', 10.95, 12.55, VOICE)
clip('lachen-24', 'gelaechter', 'laugh', 14.25, 15.9, VOICE)
clip('lachen-25', 'maedchen', 'laugh', 0.0, 1.28, VOICE)
# ---- a few people going "ohhh" and "ahhh", and a second applause ----
clip('jubel-4', 'ohhh', 'cheer', 0.25, 2.2, CHEER)
clip('jubel-5', 'ohhh', 'cheer', 2.8, 4.4, CHEER)
clip('applaus-2', 'schulfest', 'applause', 0.7, 9.5, '--rms -22 --peak -2 --fi 40 --fo 1200 --hp 120 --kbps 56')
