# Knot Game + Classifier Integration Setup

## Architecture Overview

```
┌─────────────────┐          HTTP          ┌──────────────────────┐
│   Game Server   │ ─────────────────────> │ Classifier Service   │
│   (Flask)       │     /api/classify      │ (SageMath + Flask)   │
│   Port 5000     │ <───────────────────── │   Port 5001          │
└─────────────────┘                        └──────────────────────┘
     knotlink repo                          knot_mosaics repo
```

## Setup Instructions

### 1. Setup Classifier Service (knot_mosaics repo)

#### Option A: Using Docker (Recommended)

Create `Dockerfile` in the `knot_mosaics` repository:

```dockerfile
FROM sagemath/sagemath:latest

# Install Flask and Flask-CORS
RUN sage -pip install flask flask-cors

# Copy wild_mosaics.py and classifier service
WORKDIR /app
COPY wild_mosaics.py .
COPY classifier_service.py .

# Expose port
EXPOSE 5001

# Run with sage python
CMD ["sage", "-python", "classifier_service.py"]
```

Build and run:
```bash
cd knot_mosaics
docker build -t knot-classifier .
docker run -p 5001:5001 knot-classifier
```

#### Option B: Local SageMath Installation

If you have SageMath installed locally:

```bash
cd knot_mosaics
sage -pip install flask flask-cors
sage -python classifier_service.py
```

### 2. Setup Game Server (knotlink repo)

Update requirements.txt:
```bash
cd knotlink/server
pip install -r requirements.txt
pip install requests  # Add this for calling classifier service
```

Replace the files:
- `server/game_state.py` with the updated version
- `server/server.py` with the updated version

Run the server:
```bash
cd knotlink/server
python server.py
```

### 3. Verify Setup

Check both services are running:

```bash
# Check game server
curl http://localhost:5000/api/health

# Check classifier service
curl http://localhost:5001/api/health
```

Expected response from game server:
```json
{
  "status": "healthy",
  "active_games": 0,
  "classifier_service": "healthy",
  "classifier_url": "http://localhost:5001"
}
```

## Usage Example

### 1. Create a new game

```bash
curl -X POST http://localhost:5000/api/game/new \
  -H "Content-Type: application/json" \
  -d '{
    "board": [
      [0, 5, 6, 0],
      [5, -1, -1, 6],
      [6, -1, -1, 5],
      [0, 6, 5, 0]
    ],
    "starting_player": "knotter"
  }'
```

Response includes `game_id`.

### 2. Make moves

```bash
curl -X POST http://localhost:5000/api/game/{game_id}/move \
  -H "Content-Type: application/json" \
  -d '{
    "row": 1,
    "col": 1,
    "new_tile": 9
  }'
```

Continue until all crossings are resolved (all 11s become 9s or 10s).

### 3. Classify and determine winner

```bash
curl -X POST http://localhost:5000/api/game/{game_id}/classify
```

Response:
```json
{
  "is_unknot": true,
  "winner": "unknotter",
  "classification_details": {
    "is_unknot": true,
    "reason": "topology_check",
    "num_crossings": 4,
    "pd_code": [[1,2,3,4], ...]
  },
  "status": {
    "game_over": true,
    "winner": "unknotter",
    ...
  }
}
```

## Configuration

### Change Classifier URL

If running services on different machines or ports:

```bash
export CLASSIFIER_URL=http://192.168.1.100:5001
python server.py
```

Or in code, modify `server.py`:
```python
CLASSIFIER_URL = os.getenv('CLASSIFIER_URL', 'http://your-classifier-host:5001')
```

## Troubleshooting

### "Cannot connect to classifier service"

- Verify classifier service is running: `curl http://localhost:5001/api/health`
- Check firewall/network settings
- Verify CLASSIFIER_URL is correct

### "Classifier service timeout"

- Complex knots may take 10-30 seconds to classify
- Timeout is set to 30 seconds, increase if needed in `server.py`

### Import errors in classifier

- Make sure `wild_mosaics.py` is in the same directory as `classifier_service.py`
- Run with `sage -python` not regular `python`
- Verify regina and snappy are available: `sage -c "import regina; import snappy"`

## Testing with Different Mosaics

### Tile Value Reference

- `-1` - Unresolved crossing (for gameplay)
- `0` - Empty tile
- `1-4` - Corner tiles
- `5` - Horizontal connection
- `6` - Vertical connection
- `7-8` - Non-crossing double tiles
- `9` - Crossing (one orientation)
- `10` - Crossing (other orientation)

### Example: Simple Unknot (Trivial)

```json
{
  "board": [
    [0, 1, 2, 0],
    [4, 0, 0, 2],
    [1, 0, 0, 3],
    [0, 4, 3, 0]
  ]
}
```

No crossings → Should classify as unknot.

### Example: Game Board with Unresolved Crossings

```json
{
  "board": [
    [0, 5, 6, 0],
    [5, -1, -1, 6],
    [6, -1, -1, 5],
    [0, 6, 5, 0]
  ]
}
```

Players resolve the four `11`s to either `9` or `10`.

## Production Deployment

For production:

1. Use docker-compose to manage both services
2. Add authentication/authorization
3. Set `debug=False` in Flask apps
4. Use gunicorn or similar WSGI server
5. Add monitoring and logging
6. Consider caching classification results

### Example docker-compose.yml

```yaml
version: '3.8'
services:
  classifier:
    build: ./knot_mosaics
    ports:
      - "5001:5001"
    
  game-server:
    build: ./knotlink/server
    ports:
      - "5000:5000"
    environment:
      - CLASSIFIER_URL=http://classifier:5001
    depends_on:
      - classifier
```