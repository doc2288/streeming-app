import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:video_player/video_player.dart';

const String apiBase = 'http://10.0.2.2:4000';
const String wsBase = 'ws://10.0.2.2:4000';
const String sampleHls =
    'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

void main() {
  runApp(const StreemingApp());
}

class StreemingApp extends StatelessWidget {
  const StreemingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Streeming',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        colorSchemeSeed: Colors.blue,
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

// ---- Models ----

class UserInfo {
  final String id;
  final String email;
  final String role;
  UserInfo({required this.id, required this.email, required this.role});
  factory UserInfo.fromJson(Map<String, dynamic> j) =>
      UserInfo(id: j['id'], email: j['email'], role: j['role']);
}

class StreamItem {
  final String id;
  final String title;
  final String status;
  final String? ingestUrl;
  final String? streamKey;
  final String userId;
  StreamItem({
    required this.id,
    required this.title,
    required this.status,
    this.ingestUrl,
    this.streamKey,
    required this.userId,
  });
  factory StreamItem.fromJson(Map<String, dynamic> j) => StreamItem(
        id: j['id'],
        title: j['title'],
        status: j['status'],
        ingestUrl: j['ingest_url'],
        streamKey: j['stream_key'],
        userId: j['user_id'],
      );
}

// ---- API Service ----

class ApiService {
  String? accessToken;
  String? refreshToken;

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (accessToken != null) 'Authorization': 'Bearer $accessToken',
      };

  Future<Map<String, dynamic>> _post(String path, Map<String, dynamic> body) async {
    final resp = await http.post(Uri.parse('$apiBase$path'),
        headers: _headers, body: jsonEncode(body));
    if (resp.statusCode >= 400) {
      final err = jsonDecode(resp.body);
      throw Exception(err['error'] ?? 'Request failed');
    }
    return jsonDecode(resp.body);
  }

  Future<Map<String, dynamic>> _get(String path) async {
    final resp = await http.get(Uri.parse('$apiBase$path'), headers: _headers);
    if (resp.statusCode >= 400) {
      throw Exception('Request failed');
    }
    return jsonDecode(resp.body);
  }

  Future<UserInfo> register(String email, String password) async {
    final data = await _post('/auth/register', {'email': email, 'password': password});
    accessToken = data['accessToken'];
    refreshToken = data['refreshToken'];
    return UserInfo.fromJson(data['user']);
  }

  Future<UserInfo> login(String email, String password) async {
    final data = await _post('/auth/login', {'email': email, 'password': password});
    accessToken = data['accessToken'];
    refreshToken = data['refreshToken'];
    return UserInfo.fromJson(data['user']);
  }

  Future<List<StreamItem>> getStreams() async {
    final data = await _get('/streams');
    return (data['streams'] as List).map((s) => StreamItem.fromJson(s)).toList();
  }

  Future<StreamItem> createStream(String title) async {
    final data = await _post('/streams', {'title': title});
    return StreamItem.fromJson(data['stream']);
  }

  Future<void> startStream(String id) async {
    await _post('/streams/$id/start', {});
  }

  Future<void> stopStream(String id) async {
    await _post('/streams/$id/stop', {});
  }

  void logout() {
    if (refreshToken != null) {
      _post('/auth/logout', {'refreshToken': refreshToken}).catchError((_) {});
    }
    accessToken = null;
    refreshToken = null;
  }
}

final apiService = ApiService();

// ---- Home Page ----

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  UserInfo? _user;
  List<StreamItem> _streams = [];
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _loadStreams();
  }

  Future<void> _loadStreams() async {
    try {
      final streams = await apiService.getStreams();
      setState(() => _streams = streams);
    } catch (_) {}
  }

  void _showAuth() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => AuthPage(
      onSuccess: (user) {
        setState(() => _user = user);
        _loadStreams();
        Navigator.pop(context);
      },
    )));
  }

  void _showCreateStream() {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Новий стрім'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(
            hintText: 'Назва стріму',
            border: OutlineInputBorder(),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Скасувати')),
          FilledButton(
            onPressed: () async {
              if (controller.text.trim().length < 3) return;
              try {
                await apiService.createStream(controller.text.trim());
                Navigator.pop(ctx);
                await _loadStreams();
              } catch (e) {
                if (ctx.mounted) {
                  ScaffoldMessenger.of(ctx).showSnackBar(
                    SnackBar(content: Text('$e')),
                  );
                }
              }
            },
            child: const Text('Створити'),
          ),
        ],
      ),
    );
  }

  void _logout() {
    apiService.logout();
    setState(() {
      _user = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final live = _streams.where((s) => s.status == 'live').toList();
    final offline = _streams.where((s) => s.status != 'live').toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Streeming'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadStreams,
          ),
          if (_user == null)
            TextButton(
              onPressed: _showAuth,
              child: const Text('Увійти'),
            )
          else ...[
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Center(child: Text(_user!.email, style: const TextStyle(fontSize: 12))),
            ),
            IconButton(onPressed: _logout, icon: const Icon(Icons.logout)),
          ],
        ],
      ),
      floatingActionButton: _user != null
          ? FloatingActionButton(
              onPressed: _showCreateStream,
              child: const Icon(Icons.add),
            )
          : null,
      body: RefreshIndicator(
        onRefresh: _loadStreams,
        child: ListView(
          padding: const EdgeInsets.all(12),
          children: [
            if (live.isNotEmpty) ...[
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Text('LIVE (${live.length})',
                    style: const TextStyle(
                        color: Colors.red, fontWeight: FontWeight.bold)),
              ),
              ...live.map((s) => _StreamCard(
                    stream: s,
                    user: _user,
                    onRefresh: _loadStreams,
                  )),
              const SizedBox(height: 16),
            ],
            if (offline.isNotEmpty) ...[
              const Padding(
                padding: EdgeInsets.only(bottom: 8),
                child: Text('Офлайн',
                    style: TextStyle(fontWeight: FontWeight.bold)),
              ),
              ...offline.map((s) => _StreamCard(
                    stream: s,
                    user: _user,
                    onRefresh: _loadStreams,
                  )),
            ],
            if (_streams.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(40),
                  child: Text('Поки немає стрімів', style: TextStyle(color: Colors.grey)),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

// ---- Auth Page ----

class AuthPage extends StatefulWidget {
  final void Function(UserInfo user) onSuccess;
  const AuthPage({super.key, required this.onSuccess});

  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  final _emailC = TextEditingController();
  final _passC = TextEditingController();
  bool _loading = false;
  String? _error;

  Future<void> _submit(bool isRegister) async {
    if (_emailC.text.trim().isEmpty || _passC.text.length < 8) {
      setState(() => _error = 'Email та пароль (мін. 8 символів) обов\'язкові');
      return;
    }
    setState(() { _loading = true; _error = null; });
    try {
      final user = isRegister
          ? await apiService.register(_emailC.text.trim(), _passC.text)
          : await apiService.login(_emailC.text.trim(), _passC.text);
      widget.onSuccess(user);
    } catch (e) {
      setState(() => _error = '$e');
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _emailC.dispose();
    _passC.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Вхід / Реєстрація')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _emailC,
              decoration: const InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _passC,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Пароль',
                border: OutlineInputBorder(),
              ),
            ),
            if (_error != null) ...[
              const SizedBox(height: 12),
              Text(_error!, style: const TextStyle(color: Colors.red)),
            ],
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: FilledButton(
                    onPressed: _loading ? null : () => _submit(false),
                    child: _loading
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                        : const Text('Увійти'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton(
                    onPressed: _loading ? null : () => _submit(true),
                    child: const Text('Зареєструватись'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ---- Stream Card ----

class _StreamCard extends StatelessWidget {
  final StreamItem stream;
  final UserInfo? user;
  final VoidCallback onRefresh;

  const _StreamCard({required this.stream, this.user, required this.onRefresh});

  @override
  Widget build(BuildContext context) {
    final isOwner = user != null && user!.id == stream.userId;

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () {
          Navigator.push(context, MaterialPageRoute(
            builder: (_) => WatchPage(stream: stream, user: user),
          ));
        },
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(stream.title,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: stream.status == 'live' ? Colors.red : Colors.grey[800],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      stream.status == 'live' ? 'LIVE' : 'offline',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: stream.status == 'live' ? Colors.white : Colors.grey,
                      ),
                    ),
                  ),
                ],
              ),
              if (isOwner) ...[
                const SizedBox(height: 8),
                Row(
                  children: [
                    if (stream.status != 'live')
                      ElevatedButton.icon(
                        onPressed: () async {
                          await apiService.startStream(stream.id);
                          onRefresh();
                        },
                        icon: const Icon(Icons.play_arrow, size: 16),
                        label: const Text('Старт'),
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                      )
                    else
                      ElevatedButton.icon(
                        onPressed: () async {
                          await apiService.stopStream(stream.id);
                          onRefresh();
                        },
                        icon: const Icon(Icons.stop, size: 16),
                        label: const Text('Стоп'),
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                      ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

// ---- Watch Page (Player + Chat) ----

class WatchPage extends StatefulWidget {
  final StreamItem stream;
  final UserInfo? user;
  const WatchPage({super.key, required this.stream, this.user});

  @override
  State<WatchPage> createState() => _WatchPageState();
}

class _WatchPageState extends State<WatchPage> {
  VideoPlayerController? _player;
  String? _error;

  @override
  void initState() {
    super.initState();
    _initPlayer();
  }

  Future<void> _initPlayer() async {
    try {
      final controller = VideoPlayerController.networkUrl(Uri.parse(sampleHls));
      await controller.initialize();
      controller.play();
      setState(() => _player = controller);
    } catch (e) {
      setState(() => _error = 'Не вдалось запустити відео: $e');
    }
  }

  @override
  void dispose() {
    _player?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.stream.title),
        actions: [
          if (widget.stream.status == 'live')
            const Padding(
              padding: EdgeInsets.all(12),
              child: Chip(label: Text('LIVE'), backgroundColor: Colors.red),
            ),
        ],
      ),
      body: Column(
        children: [
          if (_error != null)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Text(_error!, style: const TextStyle(color: Colors.red)),
            )
          else if (_player != null && _player!.value.isInitialized)
            AspectRatio(
              aspectRatio: _player!.value.aspectRatio,
              child: VideoPlayer(_player!),
            )
          else
            const SizedBox(
              height: 200,
              child: Center(child: CircularProgressIndicator()),
            ),
          Expanded(
            child: ChatWidget(streamId: widget.stream.id),
          ),
        ],
      ),
    );
  }
}

// ---- Chat Widget ----

class ChatWidget extends StatefulWidget {
  final String streamId;
  const ChatWidget({super.key, required this.streamId});

  @override
  State<ChatWidget> createState() => _ChatWidgetState();
}

class _ChatWidgetState extends State<ChatWidget> {
  final _msgC = TextEditingController();
  final _scrollC = ScrollController();
  final List<Map<String, dynamic>> _messages = [];

  @override
  void dispose() {
    _msgC.dispose();
    _scrollC.dispose();
    super.dispose();
  }

  void _send() {
    final text = _msgC.text.trim();
    if (text.isEmpty || text.length > 500) return;
    setState(() {
      _messages.add({'userId': 'me', 'message': text, 'ts': DateTime.now().millisecondsSinceEpoch});
    });
    _msgC.clear();
    Future.delayed(const Duration(milliseconds: 50), () {
      if (_scrollC.hasClients) {
        _scrollC.animateTo(_scrollC.position.maxScrollExtent,
            duration: const Duration(milliseconds: 200), curve: Curves.easeOut);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          color: Colors.grey[900],
          child: const Row(
            children: [
              Icon(Icons.chat, size: 16),
              SizedBox(width: 6),
              Text('Чат', style: TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
        ),
        Expanded(
          child: _messages.isEmpty
              ? const Center(
                  child: Text('Ще немає повідомлень',
                      style: TextStyle(color: Colors.grey)),
                )
              : ListView.builder(
                  controller: _scrollC,
                  padding: const EdgeInsets.all(8),
                  itemCount: _messages.length,
                  itemBuilder: (_, i) {
                    final m = _messages[i];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('${m['userId']}: ',
                              style: const TextStyle(
                                  color: Colors.blue, fontWeight: FontWeight.bold, fontSize: 13)),
                          Expanded(
                            child: Text('${m['message']}', style: const TextStyle(fontSize: 13)),
                          ),
                        ],
                      ),
                    );
                  },
                ),
        ),
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            border: Border(top: BorderSide(color: Colors.grey[800]!)),
          ),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _msgC,
                  maxLength: 500,
                  decoration: const InputDecoration(
                    hintText: 'Повідомлення…',
                    border: OutlineInputBorder(),
                    counterText: '',
                    isDense: true,
                    contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  ),
                  onSubmitted: (_) => _send(),
                ),
              ),
              const SizedBox(width: 8),
              IconButton.filled(
                onPressed: _send,
                icon: const Icon(Icons.send, size: 18),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
