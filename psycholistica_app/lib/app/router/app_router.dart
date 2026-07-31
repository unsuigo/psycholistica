import 'package:_app/features/content/presentation/pages/content_details_page.dart';
import 'package:_app/features/home/presentation/pages/home_page.dart';
import 'package:_app/features/player/presentation/pages/player_page.dart';
import 'package:_app/shared/models/content.dart';
import 'package:go_router/go_router.dart';

final appRouter = GoRouter(
  routes: [
    GoRoute(path: '/', builder: (context, state) => const HomePage()),
    GoRoute(
      path: '/content',
      name: 'contentDetails',
      builder: (context, state) {
        final content = state.extra as Content;

        return ContentDetailsPage(content: content);
      },
    ),
    GoRoute(
      path: '/player',
      name: 'player',
      builder: (context, state) {
        final content = state.extra as Content;

        return PlayerPage(content: content);
      },
    ),
  ],
);
