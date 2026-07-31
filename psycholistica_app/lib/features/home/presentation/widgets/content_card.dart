import 'dart:io';

import 'package:_app/core/services/media_service.dart';
import 'package:_app/shared/models/content.dart';
import 'package:flutter/material.dart';

class ContentCard extends StatelessWidget {
  const ContentCard({required this.content, this.onTap, super.key});

  final Content content;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final imagePath = const MediaService().imagePath(content.imageFile);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
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
                        color: colorScheme.onSurfaceVariant,
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 12),
              Text(
                content.title,
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      content.type.name,
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ),
                  Chip(label: Text(content.isPremium ? 'Premium' : 'Free')),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
