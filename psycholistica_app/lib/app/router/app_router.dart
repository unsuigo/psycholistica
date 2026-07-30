import 'package:_app/features/home/presentation/pages/home_page.dart';
import 'package:go_router/go_router.dart';

final appRouter = GoRouter(
  routes: [GoRoute(path: '/', builder: (context, state) => const HomePage())],
);
