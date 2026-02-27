import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

void main() {
  runApp(const StreemingApp());
}

class StreemingApp extends StatelessWidget {
  const StreemingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Streeming',
      theme: ThemeData.dark(),
      home: const PlayerScreen(),
    );
  }
}

class PlayerScreen extends StatefulWidget {
  const PlayerScreen({super.key});

  @override
  State<PlayerScreen> createState() => _PlayerScreenState();
}

class _PlayerScreenState extends State<PlayerScreen> {
  final TextEditingController _controller = TextEditingController(
    text: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  );
  VideoPlayerController? _player;

  @override
  void dispose() {
    _player?.dispose();
    _controller.dispose();
    super.dispose();
  }

  Future<void> _play() async {
    final url = _controller.text.trim();
    if (url.isEmpty) return;
    final controller = VideoPlayerController.networkUrl(Uri.parse(url));
    await controller.initialize();
    controller.play();
    setState(() {
      _player?.dispose();
      _player = controller;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Streeming Mobile')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _controller,
              decoration: const InputDecoration(
                labelText: 'HLS URL',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: _play,
              child: const Text('Play'),
            ),
            const SizedBox(height: 12),
            if (_player != null && _player!.value.isInitialized)
              AspectRatio(
                aspectRatio: _player!.value.aspectRatio,
                child: VideoPlayer(_player!),
              )
            else
              const Text('Вставте HLS URL і натисніть Play'),
          ],
        ),
      ),
    );
  }
}
