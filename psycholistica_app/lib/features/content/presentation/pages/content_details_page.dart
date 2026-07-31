import 'dart:io';

import 'package:_app/core/services/media_service.dart';
import 'package:_app/shared/models/content.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ContentDetailsPage extends StatelessWidget {
  const ContentDetailsPage({required this.content, super.key});

  final Content content;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final imagePath = const MediaService().imagePath(content.imageFile);

    return Scaffold(
      appBar: AppBar(title: Text(content.title)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 900),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AspectRatio(
                  aspectRatio: 16 / 9,
                  child: Image.file(
                    File(imagePath),
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return ColoredBox(
                        color: colorScheme.surfaceContainerHighest,
                        child: Icon(
                          Icons.image_outlined,
                          size: 64,
                          color: colorScheme.onSurfaceVariant,
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 24),
                Text(content.title, style: textTheme.headlineMedium),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        content.type.name,
                        style: textTheme.bodyLarge,
                      ),
                    ),
                    Chip(label: Text(content.isPremium ? 'Premium' : 'Free')),
                  ],
                ),
                const SizedBox(height: 24),
                Text(content.description, style: textTheme.bodyLarge),
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: FilledButton(
                    onPressed: () {
                      context.pushNamed('player', extra: content);
                    },
                    child: const Text('Play'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
